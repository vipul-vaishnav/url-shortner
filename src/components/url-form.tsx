'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Link, X } from 'lucide-react'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from './ui/card'
import { AnimatePresence, motion } from 'motion/react'
import useMeasure from 'react-use-measure'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod/v4'
import { Checkbox } from './ui/checkbox'

const FormSchema = z.object({
  title: z.string().min(4, {
    message: 'Title must be at least 4 characters.'
  }),
  destinationUrl: z
    .url({
      protocol: /^https?$/,
      hostname: /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
      error: 'Invalid URL format'
    })
    .refine(
      (ctx) => {
        if (!ctx.startsWith('http://')) {
          return true
        }
      },
      { error: 'URL must start with https://' }
    ),
  enableAnalytics: z.boolean()
})

const UrlForm: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [ref, bounds] = useMeasure()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      enableAnalytics: false,
      title: '',
      destinationUrl: ''
    }
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
  }

  return (
    <motion.div animate={{ height: bounds.height }} className="w-full max-w-screen-md mx-auto">
      <div ref={ref}>
        {open ? (
          <AnimatePresence>
            <motion.div layoutId="wrapper">
              <Card className="mt-6 sm:px-6 px-2 py-6">
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
                            Shorten Link
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        ) : (
          <AnimatePresence>
            <motion.div layoutId="wrapper" className="grid place-content-center">
              <Button onClick={() => setOpen(true)} className="mt-6" size={'lg'}>
                <motion.div layoutId="title" className="flex items-center gap-2">
                  <Link />
                  Create New Link
                </motion.div>
              </Button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  )
}
export default UrlForm
