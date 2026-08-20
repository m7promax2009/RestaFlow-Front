// Restoran sozlamalari — soliq, xizmat haqi, valyuta. Faqat admin/manager ko'radi va o'zgartira oladi.
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { getSettings, updateSettings } from '../api'
import { unwrap, apiErrorMessage } from '../../../lib/api'
import { Button, Card, Input, PageHeader, Skeleton } from '../../../components/ui'

const EMPTY_FORM = { restaurantName: '', taxRate: 0, serviceFee: 0, currency: '' }

export default function SettingsPage() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState(EMPTY_FORM)

  const settingsQuery = useQuery({
    queryKey: ['settings'],
    queryFn: async () => unwrap(await getSettings(), 'settings'),
  })

  // Backenddan kelgan qiymatlar bilan formani to'ldirish (faqat birinchi yuklanishda).
  useEffect(() => {
    if (settingsQuery.data) {
      setForm({
        restaurantName: settingsQuery.data.restaurantName ?? '',
        taxRate: settingsQuery.data.taxRate ?? 0,
        serviceFee: settingsQuery.data.serviceFee ?? 0,
        currency: settingsQuery.data.currency ?? '',
      })
    }
  }, [settingsQuery.data])

  const saveMutation = useMutation({
    mutationFn: () =>
      updateSettings({
        restaurantName: form.restaurantName,
        taxRate: Number(form.taxRate),
        serviceFee: Number(form.serviceFee),
        currency: form.currency,
      }),
    onSuccess: () => {
      toast.success('Sozlamalar saqlandi')
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
    onError: (error) => toast.error(apiErrorMessage(error, "Saqlab bo'lmadi")),
  })

  const setField = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  if (settingsQuery.isLoading) {
    return (
      <div>
        <PageHeader title="Sozlamalar" />
        <Card>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Sozlamalar" subtitle="Restoran nomi, soliq, xizmat haqi va valyuta" />

      <Card className="max-w-lg">
        <div className="space-y-4">
          <Input
            label="Restoran nomi"
            value={form.restaurantName}
            onChange={setField('restaurantName')}
          />
          <Input
            label="Soliq (NDS), %"
            type="number"
            min={0}
            max={100}
            step="0.1"
            value={form.taxRate}
            onChange={setField('taxRate')}
          />
          <Input
            label="Xizmat haqi, %"
            type="number"
            min={0}
            max={100}
            step="0.1"
            value={form.serviceFee}
            onChange={setField('serviceFee')}
          />
          <Input
            label="Valyuta"
            value={form.currency}
            onChange={setField('currency')}
            placeholder="so'm"
          />

          <Button
            onClick={() => saveMutation.mutate()}
            isLoading={saveMutation.isPending}
            className="w-full"
          >
            Saqlash
          </Button>
        </div>
      </Card>
    </div>
  )
}