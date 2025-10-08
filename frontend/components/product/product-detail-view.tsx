"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Sun,
  Moon,
  Home,
  Search,
  ShoppingCart,
  User,
  Package,
  Ruler,
  Weight,
  Plus,
  Minus,
  TrendingUp,
  TrendingDown,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterSection } from "@/components/ui/filter-section";
import { CheckboxFilter } from "@/components/ui/checkbox-filter";
import { PipeBadge } from "@/components/ui/pipe-badge";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/contexts/cart-context";
import { useTheme } from "@/lib/contexts/theme-context";
import {
  calculatePrice,
  formatPrice,
  formatQuantity,
  getUniqueValues,
} from "@/lib/utils/data-utils";
import type { Product, FilterState, UnitType } from "@/lib/types";
import { mockTypes, mockStocks } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/////////////////////////
// Header
export function Header() {
  const { theme, setTheme } = useTheme();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-center px-4 relative">
        <Link href="/" className="flex items-center justify-center">
          <div className="flex h-10 items-center justify-center">
            <Image
              src="/logo.png"
              alt="TMK Logo"
              className="object-contain"
              priority
            />
          </div>
        </Link>
        <div className="absolute right-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}

/////////////////////////
// Bottom Navigation
const navItems = [
  { href: "/", icon: Home, label: "Каталог" },
  { href: "/search", icon: Search, label: "Поиск" },
  { href: "/cart", icon: ShoppingCart, label: "Корзина" },
  { href: "/profile", icon: User, label: "Профиль" },
];
export function BottomNav() {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/";
  const { itemCount } = useCart();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors",
                isActive
                  ? "text-[#EE742D]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                {item.href === "/profile" ? (
                  <Package
                    className="h-5 w-5"
                    style={{
                      color: pathname === item.href ? "#EE742D" : undefined,
                    }}
                  />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
                {item.href === "/cart" && itemCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#EE742D] text-[10px] font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/////////////////////////
// Product Filters
interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  products: Product[];
  diameterRange: [number, number];
  thicknessRange: [number, number];
  onReset?: () => void;
}
export function ProductFilters({
  filters,
  onFiltersChange,
  products,
  diameterRange,
  thicknessRange,
  onReset,
}: ProductFiltersProps) {
  const warehouses = mockStocks.map((s) => s.Stock);
  const productTypes = mockTypes.map((t) => t.Type);
  const gostOptions = getUniqueValues(products, "Gost");
  const steelGradeOptions = getUniqueValues(products, "SteelGrade");
  const hasActiveFilters =
    filters.warehouse.length > 0 ||
    filters.productType.length > 0 ||
    filters.gost.length > 0 ||
    filters.steelGrade.length > 0 ||
    filters.search !== "" ||
    filters.diameterRange[0] !== diameterRange[0] ||
    filters.diameterRange[1] !== diameterRange[1] ||
    filters.thicknessRange[0] !== thicknessRange[0] ||
    filters.thicknessRange[1] !== thicknessRange[1];

  return (
    <div className="space-y-0">
      <FilterSection title="Поиск" defaultOpen={true}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="ID или название..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="pl-9 h-9"
          />
        </div>
      </FilterSection>

      <FilterSection title="Склад">
        <CheckboxFilter
          options={warehouses}
          selected={filters.warehouse}
          onChange={(warehouse) => onFiltersChange({ ...filters, warehouse })}
        />
      </FilterSection>

      <FilterSection title="Тип продукции">
        <CheckboxFilter
          options={productTypes}
          selected={filters.productType}
          onChange={(productType) =>
            onFiltersChange({ ...filters, productType })
          }
        />
      </FilterSection>

      <FilterSection title="Диаметр" defaultOpen={true}>
        <div className="space-y-3 pl-2">
          <Input
            type="number"
            value={filters.diameterRange[0]}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                diameterRange: [
                  Number(e.target.value),
                  filters.diameterRange[1],
                ],
              })
            }
          />
          <Input
            type="number"
            value={filters.diameterRange[1]}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                diameterRange: [
                  filters.diameterRange[0],
                  Number(e.target.value),
                ],
              })
            }
          />
        </div>
      </FilterSection>

      <FilterSection title="Толщина стенки" defaultOpen={true}>
        <div className="space-y-3 pl-2">
          <Input
            type="number"
            value={filters.thicknessRange[0]}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                thicknessRange: [
                  Number(e.target.value),
                  filters.thicknessRange[1],
                ],
              })
            }
          />
          <Input
            type="number"
            value={filters.thicknessRange[1]}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                thicknessRange: [
                  filters.thicknessRange[0],
                  Number(e.target.value),
                ],
              })
            }
          />
        </div>
      </FilterSection>

      <FilterSection title="ГОСТ">
        <CheckboxFilter
          options={gostOptions}
          selected={filters.gost}
          onChange={(gost) => onFiltersChange({ ...filters, gost })}
        />
      </FilterSection>

      <FilterSection title="Марка стали">
        <CheckboxFilter
          options={steelGradeOptions}
          selected={filters.steelGrade}
          onChange={(steelGrade) => onFiltersChange({ ...filters, steelGrade })}
        />
      </FilterSection>

      {hasActiveFilters && onReset && (
        <div className="pt-4 pb-2">
          <Button
            onClick={onReset}
            className="w-full bg-[#EE742D] hover:bg-[#EE742D]/90 text-white"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Сбросить фильтры
          </Button>
        </div>
      )}
    </div>
  );
}

/////////////////////////
// Product Sort
type SortOption = "price-asc" | "price-desc" | "stock" | "updated";
interface ProductSortProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}
export function ProductSort({ value, onChange }: ProductSortProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Сортировка" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="updated">По дате обновления</SelectItem>
        <SelectItem value="price-asc">Цена: по возрастанию</SelectItem>
        <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
        <SelectItem value="stock">По наличию</SelectItem>
      </SelectContent>
    </Select>
  );
}

/////////////////////////
// Checkout Form
interface CheckoutFormProps {
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    inn: string;
    phone: string;
    email: string;
  }) => void;
  isSubmitting: boolean;
}
export function CheckoutForm({ onSubmit, isSubmitting }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    inn: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg border bg-card p-6"
    >
      <h2 className="mb-4 text-xl font-bold">Контактные данные</h2>
      <div className="space-y-4">
        <Input
          value={formData.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          placeholder="Имя"
        />
        <Input
          value={formData.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          placeholder="Фамилия"
        />
        <Input
          value={formData.inn}
          onChange={(e) => handleChange("inn", e.target.value)}
          placeholder="ИНН"
        />
        <Input
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="Телефон"
        />
        <Input
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="Email"
        />
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#ff5106] hover:bg-[#ff5106]/90 text-white shadow-lg shadow-[#ff5106]/20"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Отправить заказ"
        )}
      </Button>
    </form>
  );
}

/////////////////////////
// Order Summary
export function OrderSummary() {
  const { items } = useCart();
  const totals = items.reduce(
    (acc, item) => {
      const { basePrice, discountedPrice, discount } = calculatePrice(
        item.product,
        item.quantity,
        item.unit
      );
      return {
        subtotal: acc.subtotal + basePrice,
        discount: acc.discount + discount,
        total: acc.total + discountedPrice,
      };
    },
    { subtotal: 0, discount: 0, total: 0 }
  );

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="mb-4 text-xl font-bold">Ваш заказ</h2>
      <div className="space-y-4">
        {items.map((item) => {
          const { discountedPrice } = calculatePrice(
            item.product,
            item.quantity,
            item.unit
          );
          return (
            <div
              key={item.product.ID}
              className="flex justify-between gap-2 text-sm"
            >
              <div className="flex-1">
                <p className="font-medium leading-tight">{item.product.Name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatQuantity(item.quantity, item.unit)}
                </p>
              </div>
              <div className="text-right font-semibold">
                {formatPrice(discountedPrice)}
              </div>
            </div>
          );
        })}
        <div className="space-y-2 border-t pt-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Сумма:</span>
            <span className="font-semibold">
              {formatPrice(totals.subtotal)}
            </span>
          </div>
          {totals.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Скидка:</span>
              <span className="font-semibold text-green-500">
                -{formatPrice(totals.discount)}
              </span>
            </div>
          )}
          <div className="border-t pt-2">
            <div className="flex justify-between text-lg">
              <span className="font-bold">Итого:</span>
              <span className="font-bold text-[#ff5106]">
                {formatPrice(totals.total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/////////////////////////
// Product Detail View
interface ProductDetailViewProps {
  product: Product;
}
export function ProductDetailView({ product }: ProductDetailViewProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState<UnitType>("M");
  const { price, remnant, stock } = product;
  const hasStock = remnant && (remnant.InStockT > 0 || remnant.InStockM > 0);
  const { basePrice, discountedPrice, discount } = price
    ? calculatePrice(product, quantity, unit)
    : { basePrice: 0, discountedPrice: 0, discount: 0 };
  const priceChange = Math.random() > 0.5 ? "up" : "down";

  const handleAddToCart = () => {
    addItem(product, quantity, unit);
    toast({
      title: "Добавлено в корзину",
      description: `${product.Name} - ${formatQuantity(quantity, unit)}`,
    });
  };

  const handleBuyNow = () => {
    addItem(product, quantity, unit);
    router.push("/cart");
  };
  const handleIncrement = () =>
    setQuantity((prev) => prev + (unit === "M" ? 1 : 0.1));
  const handleDecrement = () =>
    setQuantity((prev) =>
      Math.max(unit === "M" ? 1 : 0.1, prev - (unit === "M" ? 1 : 0.1))
    );

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 space-y-6 pb-32 lg:pb-28">
      {/* Header, price, specs, stock, add to cart */}
      <h1 className="text-2xl sm:text-3xl font-bold">{product.Name}</h1>
      <p className="text-sm text-muted-foreground">Артикул: {product.ID}</p>
      {hasStock ? (
        <Badge variant="outline" className="border-green-500/50 text-green-500">
          В наличии
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="border-destructive/50 text-destructive"
        >
          Нет в наличии
        </Badge>
      )}
      {/* Price, specs and cart controls here... */}
    </div>
  );
}
