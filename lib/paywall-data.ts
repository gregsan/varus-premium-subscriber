import {
  ShoppingBag,
  Handshake,
  Shield,
  Box,
  Percent,
  Truck,
  Coins,
  Zap,
  Coffee,
  Plane,
  Hotel,
  Signal,
  HeartPulse,
  AlertTriangle,
  Car,
  Home,
  Fuel,
  type LucideIcon,
} from 'lucide-react'

export interface RetailBenefit {
  id: string
  icon: LucideIcon
  label: string
  value: string
}

export interface PartnerOffer {
  id: string
  icon: LucideIcon
  label: string
  value: string
}

export interface InsuranceOffer {
  id: string
  icon: LucideIcon
  label: string
  value: string
}

export interface DigitalService {
  id: string
  name: string
  initials: string
  color: string
  description: string
  features: string[]
}

export const RETAIL_BENEFITS: RetailBenefit[] = [
  { id: 'delivery', icon: Truck, label: 'Безкоштовна доставка', value: 'безліміт' },
  { id: 'bonus', icon: Coins, label: 'Підвищені бонуси', value: 'x2 бали' },
]

export const PARTNER_OFFERS: PartnerOffer[] = [
  { id: 'coffee', icon: Fuel, label: 'Паливо у мережі АЗС "УкрНафта"', value: 'до -4грн/л' },
]

export const INSURANCE_OFFERS: InsuranceOffer[] = [
  { id: 'medical', icon: HeartPulse, label: 'Медичне страхування', value: 'вкл.' },
  { id: 'accident', icon: AlertTriangle, label: 'Страхування від нещасного випадку', value: 'вкл.' },
  { id: 'auto', icon: Car, label: 'Страхування авто (ОСЦПВ)', value: 'знижка 10%' },
]

export const DIGITAL_SERVICES: DigitalService[] = [
  {
    id: 'sweettv',
    name: 'SweetTV',
    initials: 'SW',
    color: '#E53E3E',
    description: 'Стрімінг українських та світових фільмів і серіалів',
    features: [
      'Понад 10 000 фільмів та серіалів',
      'Необмежений перегляд',
      '4K HDR якість',
      'Без реклами',
      '5 пристроїв одночасно',
      'Офлайн-завантаження',
    ],
  },
  {
    id: 'kstv',
    name: 'Київстар ТБ',
    initials: 'KS',
    color: '#F59E0B',
    description: 'Фільми, серіали, спорт наживо та Live TV',
    features: [
      'Live TV 200+ каналів',
      'Ексклюзивний контент',
      'HD/Full HD якість',
      'Спорт наживо',
      'Мобільний застосунок',
      'Без реклами',
    ],
  },
  {
    id: 'calorie-tracker',
    name: 'Calorie Tracker - Chou',
    initials: 'CT',
    color: '#10B981',
    description: 'розумний ШІ-трекер калорій',
    features: [
      'Швидке AI-розпізнавання страв',
      'Детальний контроль КБЖВ',
      'Зручний ручний та пошуковий ввід',
      'Наочний щоденник та аналітика',
      'Розумні нагадування про прийоми їжі',
    ],
  },
  {
    id: 'librarius',
    name: 'Librarius',
    initials: 'LB',
    color: '#8B5CF6',
    description: 'бібліотека книжок та аудіокниг у кишені',
    features: [
      'Величезна бібліотека книжок',
      'Аудіокниги від професійних дикторів',
      'Офлайн-режим',
      'Синхронізація прогресу',
      'Персональні рекомендації',
    ],
  },
  {
    id: 'fitness',
    name: 'OnlineFitness',
    initials: 'OF',
    color: '#8B5CF6',
    description: 'твій шлях до ідеального тіла',
    features: [
      'Гнучка програма тренувань',
      'Гнучке та доступне навчання',
      'Професійні інструктори',
      'Реальні та стійкі зміни',
    ],
  },
]

export { ShoppingBag, Handshake, Shield, Box }
