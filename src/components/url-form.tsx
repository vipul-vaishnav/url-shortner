'use client'

import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { Copy, Link, X } from 'lucide-react'
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
import { toast } from 'sonner'

const UrlForm: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [ref, bounds] = useMeasure()
  const [machineId, setMachineId] = useState<string | null>(null)
  const [formState, setFormState] = useState<'fill' | 'success' | 'error'>('error')

  const {
    data: slugData,
    isPending,
    mutate
  } = trpc.url.shortenUrl.useMutation({
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
                {formState === 'fill' ? (
                  <>
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
                          setFormState('fill')
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
                  </>
                ) : formState === 'success' ? (
                  <>
                    <motion.div
                      key="success"
                      initial={{ y: -32, opacity: 0, filter: 'blur(4px)' }}
                      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                      transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
                      className="grid place-content-center"
                    >
                      <svg
                        className="block mx-auto"
                        width="64"
                        height="64"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M27.6 16C27.6 17.5234 27.3 19.0318 26.717 20.4392C26.1341 21.8465 25.2796 23.1253 24.2025 24.2025C23.1253 25.2796 21.8465 26.1341 20.4392 26.717C19.0318 27.3 17.5234 27.6 16 27.6C14.4767 27.6 12.9683 27.3 11.5609 26.717C10.1535 26.1341 8.87475 25.2796 7.79759 24.2025C6.72043 23.1253 5.86598 21.8465 5.28302 20.4392C4.70007 19.0318 4.40002 17.5234 4.40002 16C4.40002 12.9235 5.62216 9.97301 7.79759 7.79759C9.97301 5.62216 12.9235 4.40002 16 4.40002C19.0765 4.40002 22.027 5.62216 24.2025 7.79759C26.3779 9.97301 27.6 12.9235 27.6 16Z"
                          fill="#FCB04B"
                          fillOpacity="0.16"
                        />
                        <path
                          d="M12.1334 16.9667L15.0334 19.8667L19.8667 13.1M27.6 16C27.6 17.5234 27.3 19.0318 26.717 20.4392C26.1341 21.8465 25.2796 23.1253 24.2025 24.2025C23.1253 25.2796 21.8465 26.1341 20.4392 26.717C19.0318 27.3 17.5234 27.6 16 27.6C14.4767 27.6 12.9683 27.3 11.5609 26.717C10.1535 26.1341 8.87475 25.2796 7.79759 24.2025C6.72043 23.1253 5.86598 21.8465 5.28302 20.4392C4.70007 19.0318 4.40002 17.5234 4.40002 16C4.40002 12.9235 5.62216 9.97301 7.79759 7.79759C9.97301 5.62216 12.9235 4.40002 16 4.40002C19.0765 4.40002 22.027 5.62216 24.2025 7.79759C26.3779 9.97301 27.6 12.9235 27.6 16Z"
                          stroke="#FCB04B"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="text-center space-y-4">
                        <h3 className="text-lg font-medium">URL created successfully!</h3>
                        <div className="flex items-center gap-2">
                          <Input
                            className="min-w-[350px] flex-1"
                            disabled
                            type="text"
                            value={`${window.location.origin}/${slugData?.slug ?? '31xe8ab'}`}
                          />
                          <Button
                            onClick={() => {
                              navigator.clipboard
                                .writeText(`${window.location.origin}/${slugData?.slug ?? '31xe8ab'}`)
                                .then(() => {
                                  return toast.success('Link copied to clipboard!', {
                                    description: 'You can now share your shortened URL.'
                                  })
                                })
                                .catch((err) => {
                                  console.error('Failed to copy: ', err)
                                })
                            }}
                            size={'icon'}
                            variant={'outline'}
                          >
                            <Copy />
                          </Button>
                        </div>
                        <p>Thanks for using ZURL!</p>
                      </div>
                      <Button
                        className="mt-6"
                        size={'lg'}
                        onClick={() => {
                          setFormState('fill')
                          form.reset()
                        }}
                      >
                        Create Another Link
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      key="success"
                      initial={{ y: -32, opacity: 0, filter: 'blur(4px)' }}
                      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                      transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
                      className="grid place-content-center"
                    >
                      <div className="p-4 rounded-full border-5 border-[#fbb04b] w-13 h-13 bg-[#fbb04b]/17 grid place-content-center mx-auto">
                        <X color="#fbb04b" strokeWidth={3.5} />
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-medium">Error</h3>
                        <p>Error shortening the URL, Please try again!</p>
                      </div>
                      <Button
                        className="mt-6"
                        size={'lg'}
                        onClick={() => {
                          setFormState('fill')
                          form.reset()
                        }}
                      >
                        Try again
                      </Button>
                    </motion.div>
                  </>
                )}
              </Card>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
export default UrlForm
