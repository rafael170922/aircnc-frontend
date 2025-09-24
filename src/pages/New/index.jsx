import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import api from "../../services/api";
import camera from "../../assets/camera.svg";

import "./styles.css";

// --- Definição do schema de validação com Zod ---
const newSpotSchema = z.object({
  company: z.string().min(1, "O nome da empresa é obrigatório"),
  techs: z.string().min(1, "As tecnologias são obrigatórias"),
  price: z
    .string()
    .optional()
    .refine((val) => !val || /^\d+(\.\d{1,2})?$/.test(val), {
      message: "O preço deve ser um número válido",
    }),
  thumbnail: z
  .any()
  .refine(file => file && file instanceof File, {
    message: 'A imagem é obrigatória',
  }),

});

export function New() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NewSpotFormData>({
    resolver: zodResolver(newSpotSchema),
  });

  const thumbnail = watch("thumbnail");
  const preview = useMemo(
    () => (thumbnail ? URL.createObjectURL(thumbnail) : null),
    [thumbnail]
  );

    async function onSubmit(data) {

    const formData = new FormData();
    const user_id = localStorage.getItem("user");

    formData.append("thumbnail", data.thumbnail!);
    formData.append("company", data.company);
    formData.append("techs", data.techs);
    formData.append("price", data.price ?? "");

    await api.post("/spots/", formData, {
      headers: { user_id },
    });

    navigate("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label
        id="thumbnail"
        style={{ backgroundImage: `url(${preview})` }}
        className={thumbnail ? "has-thumbnail" : ""}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setValue("thumbnail", file, { shouldValidate: true });
          }}
        />
        <img src={camera} alt="Select img" />
      </label>
      {errors.thumbnail && <p className="error">{errors.thumbnail.message}</p>}

      <label htmlFor="company">*EMPRESA</label>
      <input
        type="text"
        id="company"
        placeholder="Sua empresa incrível"
        {...register("company")}
      />
      {errors.company && <p className="error">{errors.company.message}</p>}

      <label htmlFor="techs">*TECNOLOGIAS (separadas por vírgula)</label>
      <input
        type="text"
        id="techs"
        placeholder="Quais tecnologias usam?"
        {...register("techs")}
      />
      {errors.techs && <p className="error">{errors.techs.message}</p>}

      <label htmlFor="price">
        *VALOR DA DIÁRIA (em branco para GRATUITO)
      </label>
      <input
        type="text"
        id="price"
        placeholder="Valor cobrado por dia"
        {...register("price")}
      />
      {errors.price && <p className="error">{errors.price.message}</p>}

      <button type="submit" className="btn">
        Cadastrar
      </button>
    </form>
  );
}
