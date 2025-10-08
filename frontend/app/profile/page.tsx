"use client"

import { useState } from "react"
import { getTelegramUser } from "@/lib/utils/telegram"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, Mail, Building2, Package, Edit2, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const telegramUser = getTelegramUser()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)

  const [profile, setProfile] = useState({
    firstName: telegramUser?.first_name || "",
    lastName: telegramUser?.last_name || "",
    phone: "",
    email: "",
    inn: "",
    company: "",
  })

  const handleSave = () => {
    // In a real app, this would save to backend
    toast({
      title: "Профиль обновлен",
      description: "Ваши данные успешно сохранены",
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset to original values
    setProfile({
      firstName: telegramUser?.first_name || "",
      lastName: telegramUser?.last_name || "",
      phone: "",
      email: "",
      inn: "",
      company: "",
    })
    setIsEditing(false)
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-4 sm:py-6">
      <div className="mb-4 sm:mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Профиль</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Информация о пользователе</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="bg-transparent">
            <Edit2 className="h-4 w-4 mr-2" />
            Редактировать
          </Button>
        )}
      </div>

      <div className="space-y-3 sm:space-y-4">
        {/* User info */}
        <div className="rounded-lg border bg-card p-4 sm:p-6">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">ФИО</h3>
            <div className="min-w-0 flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="firstName" className="text-xs">
                        Имя
                      </Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-xs">
                        Фамилия
                      </Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-lg sm:text-xl font-bold truncate">
                    {profile.firstName || profile.lastName
                      ? `${profile.firstName} ${profile.lastName}`.trim()
                      : "Не указано"}
                  </h2>
                  {telegramUser?.username && (
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">@{telegramUser.username}</p>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {/* Phone */}
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0 mt-2" />
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <div>
                    <Label htmlFor="phone" className="text-xs">
                      Телефон
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+7 (999) 123-45-67"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="h-9 text-sm"
                    />
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-muted-foreground">Телефон</p>
                    <p className="text-sm">{profile.phone || "Не указан"}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0 mt-2" />
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <div>
                    <Label htmlFor="email" className="text-xs">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@mail.ru"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="h-9 text-sm"
                    />
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm">{profile.email || "Не указан"}</p>
                  </div>
                )}
              </div>
            </div>

            {/* INN */}
            <div className="flex items-start gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground shrink-0 mt-2" />
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <div>
                    <Label htmlFor="inn" className="text-xs">
                      ИНН
                    </Label>
                    <Input
                      id="inn"
                      placeholder="1234567890"
                      value={profile.inn}
                      onChange={(e) => setProfile({ ...profile, inn: e.target.value })}
                      className="h-9 text-sm"
                      maxLength={12}
                    />
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-muted-foreground">ИНН</p>
                    <p className="text-sm">{profile.inn || "Не указан"}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Company */}
            {isEditing && (
              <div className="flex items-start gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground shrink-0 mt-2" />
                <div className="flex-1 min-w-0">
                  <Label htmlFor="company" className="text-xs">
                    Компания
                  </Label>
                  <Input
                    id="company"
                    placeholder="ООО Компания"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {isEditing && (
            <div className="mt-4 flex gap-2">
              <Button onClick={handleSave} className="flex-1 bg-[#EE742D] hover:bg-[#EE742D]/90 text-white h-9">
                Сохранить
              </Button>
              <Button onClick={handleCancel} variant="outline" className="flex-1 bg-transparent h-9">
                <X className="h-4 w-4 mr-2" />
                Отмена
              </Button>
            </div>
          )}
        </div>

        <div className="rounded-lg border bg-card p-4 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-[#EE742D]" />
            <h2 className="text-lg sm:text-xl font-bold">Мои заказы</h2>
          </div>
          <div className="rounded-lg bg-secondary/30 p-6 sm:p-8 text-center">
            <p className="text-sm sm:text-base text-muted-foreground">У вас пока нет заказов</p>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">Оформите первый заказ в каталоге</p>
          </div>
        </div>
      </div>
    </div>
  )
}
