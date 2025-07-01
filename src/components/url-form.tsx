'use client'

import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import useMeasure from 'react-use-measure'
import { z } from 'zod/v4'

import { Card, CardAction, CardContent, CardHeader, CardTitle } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'

import { FormSchema } from '@/schema/FormSchema'
import { trpc } from '@/utils/trpc'
import { getMachineId } from '@/lib/get-machine-id'

const UrlForm: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [ref, bounds] = useMeasure()
  const [machineId, setMachineId] = useState<string | null>(null)
  const [formState, setFormState] = useState<'fill' | 'success' | 'error'>('fill')

  const { isPending, mutate } = trpc.url.shortenUrl.useMutation({
    onSuccess: () => {
      setMachineId(null)
      setFormState('success')
    },
    onError: (error) => {
      setFormState('error')
      console.error('Error shortening URL:', error)
    }
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      enableAnalytics: false,
      title: '',
      destinationUrl: ''
    }
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutate({ ...data, machineId: machineId || 'unknown-machine-id' })
  }

  useEffect(() => {
    getMachineId().then((id) => setMachineId(id))
  }, [])

  return (
    <motion.div animate={{ height: bounds.height }} className="w-full max-w-screen-md mx-auto">
      <div ref={ref}>
        <AnimatePresence initial={false}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: open ? 0 : 1, visibility: open ? 'hidden' : 'visible' }}
            exit={{ opacity: 0 }}
            key="button"
            layoutId="wrapper"
            className="grid place-content-center"
          >
            <Button
              onClick={() => {
                setOpen(true)
                setFormState('fill')
              }}
              className="mt-6"
              size={'lg'}
            >
              <motion.div layoutId="title" className="flex items-center gap-2">
                <Link />
                Create New Link
              </motion.div>
            </Button>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          {open ? (
            <motion.div layoutId="wrapper">
              <Card className="-mt-6 sm:px-6 px-2 py-6">
                <CardHeader>
                  <CardTitle>
                    <motion.div layoutId="title" className="flex items-center gap-2">
                      <Link />
                      <h6 className="text-xl font-semibold tracking-tight">Create New Link</h6>
                    </motion.div>
                  </CardTitle>
                  <CardAction
                    onClick={() => {
                      form.reset()
                      setOpen(false)
                    }}
                  >
                    <Button size={'icon'} variant={'link'}>
                      <X />
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4.5">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Add Title" {...field} autoComplete="off" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="destinationUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Destination URL</FormLabel>
                              <FormControl>
                                <Input placeholder="Add URL" {...field} autoComplete="off" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="enableAnalytics"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center gap-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  ref={field.ref}
                                  name={field.name}
                                  disabled={field.disabled}
                                />
                              </FormControl>
                              <FormLabel className="text-base font-medium">Enable Click Analytics</FormLabel>
                            </FormItem>
                          )}
                        />
                        <div className="flex items-center justify-end">
                          <Button type="submit" size="lg">
                            {isPending ? 'Shortening...' : 'Shorten Link'}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
export default UrlForm
