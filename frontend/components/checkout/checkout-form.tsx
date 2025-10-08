"use client"; // Компонент работает на клиенте и использует хуки состояния

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface CheckoutFormProps {
  // Функция для обработки отправки данных формы
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    inn: string;
    phone: string;
    email: string;
  }) => void;
  isSubmitting: boolean; // Флаг состояния отправки, чтобы блокировать кнопку и показывать индикатор
}

/**
 * CheckoutForm — форма для ввода контактных данных покупателя
 * Включает валидацию полей и отображение ошибок
 */
export function CheckoutForm({ onSubmit, isSubmitting }: CheckoutFormProps) {
  // Локальное состояние данных формы
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    inn: "",
    phone: "",
    email: "",
  });

  // Состояние ошибок для каждого поля
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Функция валидации всех полей
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "Обязательное поле";
    if (!formData.lastName.trim()) newErrors.lastName = "Обязательное поле";
    if (!formData.inn.trim()) newErrors.inn = "Обязательное поле";
    else if (!/^\d{10,12}$/.test(formData.inn))
      newErrors.inn = "ИНН должен содержать 10 или 12 цифр";
    if (!formData.phone.trim()) newErrors.phone = "Обязательное поле";
    else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/[\s()-]/g, "")))
      newErrors.phone = "Некорректный номер телефона";
    if (!formData.email.trim()) newErrors.email = "Обязательное поле";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Некорректный email";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработка сабмита формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData); // Передаем валидные данные наружу
    }
  };

  // Обработка изменения значения поля
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Сбрасываем ошибку при вводе
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg border bg-card p-6"
    >
      <div>
        <h2 className="mb-4 text-xl font-bold">Контактные данные</h2>

        <div className="space-y-4">
          {/* Имя и фамилия */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                Имя <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="Иван"
                className={errors.firstName ? "border-destructive" : ""}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">
                Фамилия <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Иванов"
                className={errors.lastName ? "border-destructive" : ""}
              />
              {errors.lastName && (
                <p className="text-xs text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* ИНН */}
          <div className="space-y-2">
            <Label htmlFor="inn">
              ИНН <span className="text-destructive">*</span>
            </Label>
            <Input
              id="inn"
              value={formData.inn}
              onChange={(e) => handleChange("inn", e.target.value)}
              placeholder="1234567890"
              maxLength={12}
              className={errors.inn ? "border-destructive" : ""}
            />
            {errors.inn && (
              <p className="text-xs text-destructive">{errors.inn}</p>
            )}
          </div>

          {/* Телефон */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              Телефон <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+7 (999) 123-45-67"
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="example@company.ru"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>
        </div>
      </div>

      {/* Кнопка отправки */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#ff5106] hover:bg-[#ff5106]/90 text-white shadow-lg shadow-[#ff5106]/20"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Отправка заказа...
          </>
        ) : (
          "Отправить заказ"
        )}
      </Button>
    </form>
  );
}
