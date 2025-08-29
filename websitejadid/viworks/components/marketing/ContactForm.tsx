'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Send, Building, Mail, MessageSquare } from 'lucide-react';

interface ContactFormProps {
  type: string;
}

const contactTypes = {
  demo: {
    title: 'درخواست دمو',
    description: 'درخواست نمایش زنده قابلیت‌های ViWorkS',
    icon: Send,
    color: 'bg-blue-500/10 text-blue-600',
  },
  sales: {
    title: 'گفت‌وگو با تیم فروش',
    description: 'مشاوره فروش و اطلاعات قیمت‌گذاری',
    icon: Building,
    color: 'bg-green-500/10 text-green-600',
  },
  support: {
    title: 'پشتیبانی فنی',
    description: 'سؤالات فنی و پشتیبانی',
    icon: MessageSquare,
    color: 'bg-purple-500/10 text-purple-600',
  },
  general: {
    title: 'تماس عمومی',
    description: 'سؤالات عمومی و اطلاعات بیشتر',
    icon: Mail,
    color: 'bg-orange-500/10 text-orange-600',
  },
};

export function ContactForm({ type }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const contactType = contactTypes[type as keyof typeof contactTypes] || contactTypes.general;
  const IconComponent = contactType.icon;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-md"
      >
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">پیام شما ارسال شد</h3>
            <p className="text-muted-foreground">
              تیم ما در اسرع وقت با شما تماس خواهد گرفت.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-2xl"
    >
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`p-3 rounded-lg ${contactType.color}`}>
              <IconComponent className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl">{contactType.title}</CardTitle>
          <CardDescription>{contactType.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                  نام
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  required
                  placeholder="نام خود را وارد کنید"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">
                  نام خانوادگی
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  required
                  placeholder="نام خانوادگی خود را وارد کنید"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                ایمیل
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="example@company.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium">
                سازمان
              </label>
              <Input
                id="company"
                name="company"
                required
                placeholder="نام سازمان شما"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">
                  نقش
                </label>
                <Select name="role" required>
                  <SelectTrigger>
                    <SelectValue placeholder="نقش خود را انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ciso">CISO / مدیر امنیت</SelectItem>
                    <SelectItem value="architect">معمار امنیت</SelectItem>
                    <SelectItem value="admin">مدیر سیستم</SelectItem>
                    <SelectItem value="devops">DevOps / SRE</SelectItem>
                    <SelectItem value="procurement">تدارکات</SelectItem>
                    <SelectItem value="other">سایر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="users" className="text-sm font-medium">
                  تعداد کاربران
                </label>
                <Select name="users">
                  <SelectTrigger>
                    <SelectValue placeholder="تعداد کاربران" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-50">۱-۵۰</SelectItem>
                    <SelectItem value="51-200">۵۱-۲۰۰</SelectItem>
                    <SelectItem value="201-500">۲۰۱-۵۰۰</SelectItem>
                    <SelectItem value="501-1000">۵۰۱-۱۰۰۰</SelectItem>
                    <SelectItem value="1000+">بیش از ۱۰۰۰</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                پیام
              </label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                placeholder="لطفاً جزئیات درخواست خود را بنویسید..."
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'در حال ارسال...' : 'ارسال پیام'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
