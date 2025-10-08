"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Property } from "@/types/properties";
import {
  Eye,
  Heart,
  Share2,
  MapPin,
  Home,
  DollarSign,
  Calendar,
  User,
} from "lucide-react";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { t, ready } = useTranslation();
  const router = useRouter();

  const formatPrice = (amount: number, currency: string) => {
    if (currency === "UZS") {
      return `${(amount / 1000000).toFixed(1)}M UZS`;
    }
    return `${currency} ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case "sale":
        return ready ? t("properties.transactionTypes.sale") : "Продажа";
      case "rent":
      case "ijaraga berish":
        return ready ? t("properties.transactionTypes.rent") : "Аренда";
      case "exchange":
        return ready ? t("properties.transactionTypes.exchange") : "Обмен";
      case "sotish":
        return ready ? t("properties.transactionTypes.sale") : "Продажа";
      default:
        return type;
    }
  };

  const getStatusLabel = (status: boolean) => {
    return status
      ? ready
        ? t("properties.status.active")
        : "Активно"
      : ready
      ? t("properties.status.inactive")
      : "Неактивно";
  };

  const getStatusColor = (status: boolean) => {
    return status
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-gray-100 text-gray-800 border-gray-200";
  };

  const handleViewProperty = () => {
    router.push(`/admin/properties/${property.id}`);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Property Image */}
      <div className="relative h-48 bg-gray-100">
        {property.photos && property.photos.length > 0 ? (
          <img
            src={property.photos[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Home className="w-12 h-12" />
          </div>
        )}

        {/* Status Badge */}
        <div
          className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
            property.status ?? true
          )}`}
        >
          {getStatusLabel(property.status ?? true)}
        </div>
      </div>

      {/* Property Content */}
      <div className="p-6">
        {/* Title and Transaction Type */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {property.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {getTransactionTypeLabel(property.transaction_type)}
            </span>
            <span className="text-sm text-gray-500">ID: {property.id}</span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-center text-2xl font-bold text-gray-900">
            <DollarSign className="w-5 h-5 text-green-600 mr-1" />
            {formatPrice(property.price.amount, property.price.currency)}
          </div>
        </div>

        {/* Key Details */}
        <div className="space-y-2 mb-4">
          {/* Location */}
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span className="truncate">
              {property.location.city}, {property.location.district}
            </span>
          </div>

          {/* Category & Type */}
          <div className="flex items-center text-sm text-gray-600">
            <Home className="w-4 h-4 mr-2 text-gray-400" />
            <span>
              {property.category.name} • {property.types.name}
            </span>
          </div>

          {/* Specifications */}
          {property.specs && (
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-4 h-4 mr-2 text-gray-400">📐</div>
              <span>
                {property.specs?.area && `${property.specs.area} м²`}
                {property.specs?.rooms && ` • ${property.specs.rooms} комн.`}
                {property.specs?.floor && ` • ${property.specs.floor} эт.`}
              </span>
            </div>
          )}

          {/* Owner */}
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2 text-gray-400" />
            <span className="truncate">
              {property.user_data?.name || "Unknown User"}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span>{formatDate(property.created_at)}</span>
          </div>
        </div>

        {/* Metrics */}
        <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              <span>{property.view_count || 0}</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              <span>{property.favorite_count || 0}</span>
            </div>
            <div className="flex items-center">
              <Share2 className="w-4 h-4 mr-1" />
              <span>{property.share_count || 0}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={handleViewProperty}
            className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {ready ? t("properties.actions.view") : "Просмотр"}
          </button>
        </div>
      </div>
    </div>
  );
}
