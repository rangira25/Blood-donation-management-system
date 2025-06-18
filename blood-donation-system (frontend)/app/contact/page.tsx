"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SocialLinks } from "@/components/layout/social-links";
import { Phone, Mail, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8080/api/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "rangiraolivier105@gmail.com", // your fixed recipient email
          subject: `${formData.subject} - from ${formData.name}`,
          text: `
You received a new message from the contact form:

Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}
        `,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      toast({
        title: "Message Sent!",
        description:
          "Your message has been sent to our team. We'll get back to you shortly.",
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Contact Us</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-background">
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
            <CardDescription>
              We're here to help and answer any questions you might have. We
              look forward to hearing from you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">+250781625187</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">
                  contact@blooddonation.org
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm text-muted-foreground">
                  kk242 st , Kanombe military hospital, KIGALI City
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="space-y-2 w-full">
              <p className="text-sm font-medium">Follow Us</p>
              <SocialLinks />
            </div>
          </CardFooter>
        </Card>

        <Card className="md:col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you as soon as
              possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="XXX"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Your Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="XXX@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="How can we help you?"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Your message here..."
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Find answers to common questions about blood donation.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-medium">Who can donate blood?</h3>
            <p className="text-sm text-muted-foreground">
              Most people who are healthy, at least 17 years old, and weigh at
              least 110 pounds can donate blood.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">How often can I donate?</h3>
            <p className="text-sm text-muted-foreground">
              You can donate whole blood every 56 days, plasma every 28 days,
              and platelets every 7 days.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">
              How long does the donation process take?
            </h3>
            <p className="text-sm text-muted-foreground">
              The entire process takes about an hour, though the actual blood
              donation only takes 8-10 minutes.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Is donating blood safe?</h3>
            <p className="text-sm text-muted-foreground">
              Yes, donating blood is very safe. All equipment is sterile and
              used only once.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
