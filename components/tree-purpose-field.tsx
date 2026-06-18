'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

const purposeOptions = [
  'Familia mea',
  'O persoană dragă',
  'Copiii mei',
  'O amintire specială',
  'Un cadou',
  'Altceva',
]

export function TreePurposeField() {
  const [selectedPurpose, setSelectedPurpose] = useState('')

  return (
    <div>
      <p className="text-xs font-semibold text-forest md:text-sm">
        Ce reprezintă acest pom pentru tine?
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2 md:gap-3">
        {purposeOptions.map((option) => {
          const isSelected = selectedPurpose === option

          return (
            <label
              key={option}
              className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors md:text-sm ${
                isSelected
                  ? 'border-burgundy bg-burgundy/10 text-burgundy'
                  : 'border-forest/20 bg-cream text-forest hover:border-burgundy/60'
              }`}
            >
              <input
                type="radio"
                name="tree-purpose"
                value={option}
                checked={isSelected}
                onChange={() => setSelectedPurpose(option)}
                required
                className="sr-only"
              />
              <span
                className={`flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                  isSelected
                    ? 'border-burgundy bg-burgundy text-cream'
                    : 'border-forest/25 bg-[#fbf7ee]'
                }`}
                aria-hidden="true"
              >
                {isSelected && <Check size={14} strokeWidth={3} />}
              </span>
              <span>{option}</span>
            </label>
          )
        })}
      </div>

      {selectedPurpose === 'Altceva' && (
        <input
          type="text"
          name="tree-purpose-other"
          placeholder="Scrie ce reprezintă acest pom pentru tine."
          required
          className="mt-3 h-12 w-full rounded-xl border border-forest/20 bg-cream px-4 text-sm text-forest outline-none transition-colors placeholder:text-forest/45 focus:border-burgundy md:text-base"
        />
      )}
    </div>
  )
}
