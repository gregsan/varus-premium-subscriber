export interface InsuranceType {
  id: string
  label: string
}

export const INSURANCE_TYPES: InsuranceType[] = [
  { id: 'medical', label: 'Медичний випадок' },
  { id: 'accident', label: 'Нещасний випадок' },
  { id: 'property', label: 'Пошкодження майна' },
  { id: 'auto', label: 'ДТП / страховий випадок авто' },
]

export interface FaqItem {
  question: string
  answer: string
}

export const DASHBOARD_FAQ: FaqItem[] = [
  {
    question: 'Як активувати цифровий сервіс?',
    answer: 'Натисніть на картку сервісу в розділі "Партнерські сервіси" та оберіть "Отримати доступ". Активація відбувається миттєво.',
  },
  {
    question: 'Коли списуються бонусні бали?',
    answer: 'Бонусні бали нараховуються після кожної покупки в мережі Varus. Їх можна використати при наступній покупці в касі або онлайн.',
  },
  {
    question: 'Чи діє знижка на всі категорії товарів?',
    answer: 'Знижка до 10% поширюється на більшість категорій товарів. Виключення: алкоголь, тютюнові вироби та деякі акційні позиції.',
  },
]
