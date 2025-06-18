"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, CheckCircle2, Heart } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function EligibilityPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    gender: "",
    lastDonation: "",
    healthConditions: [] as string[],
    medications: "",
    pregnant: false,
    recentSurgery: false,
    recentTattoo: false,
    recentPiercing: false,
  })
  const [result, setResult] = useState<"eligible" | "ineligible" | null>(null)
  const [reasons, setReasons] = useState<string[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleHealthConditionToggle = (condition: string) => {
    setFormData((prev) => {
      const currentConditions = [...prev.healthConditions]
      if (currentConditions.includes(condition)) {
        return {
          ...prev,
          healthConditions: currentConditions.filter((c) => c !== condition),
        }
      } else {
        return {
          ...prev,
          healthConditions: [...currentConditions, condition],
        }
      }
    })
  }

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const checkEligibility = () => {
  const ineligibilityReasons = []

  // Check age
  if (Number.parseInt(formData.age) < 18 || Number.parseInt(formData.age) > 65) {
    ineligibilityReasons.push("Age requirement not met (must be between 18-65)")
  }

  // Check weight
  if (Number.parseInt(formData.weight) < 50) {
    ineligibilityReasons.push("Weight requirement not met (must be at least 50kg)")
  }

  // Check last donation
  if (formData.lastDonation === "less-than-3-months") {
    ineligibilityReasons.push("Last donation was less than 3 months ago")
  }

  // Check health conditions
  if (formData.healthConditions.length > 0) {
    ineligibilityReasons.push("Has one or more health conditions that may prevent donation")
  }

  // Check pregnancy
  if (formData.pregnant) {
    ineligibilityReasons.push("Currently pregnant or gave birth in the last 6 months")
  }

  // Check recent surgery
  if (formData.recentSurgery) {
    ineligibilityReasons.push("Had surgery in the last 6 months")
  }

  // Check recent tattoo or piercing
  if (formData.recentTattoo || formData.recentPiercing) {
    ineligibilityReasons.push("Had a tattoo or piercing in the last 6 months")
  }

  setReasons(ineligibilityReasons)
  setResult(ineligibilityReasons.length === 0 ? "eligible" : "ineligible")

  // 👇 Go to result step
  setStep(3)
}

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Please provide your basic information to check eligibility.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    placeholder="Enter your weight in kg"
                    value={formData.weight}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastDonation">When was your last blood donation?</Label>
                <Select
                  value={formData.lastDonation}
                  onValueChange={(value) => handleSelectChange("lastDonation", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time since last donation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never donated before</SelectItem>
                    <SelectItem value="less-than-3-months">Less than 3 months ago</SelectItem>
                    <SelectItem value="3-6-months">3-6 months ago</SelectItem>
                    <SelectItem value="more-than-6-months">More than 6 months ago</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div></div>
              <Button onClick={nextStep}>Next</Button>
            </CardFooter>
          </>
        )
      case 2:
        return (
          <>
            <CardHeader>
              <CardTitle>Health Information</CardTitle>
              <CardDescription>Please provide information about your health status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Do you have any of the following health conditions?</Label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {[
                    "Diabetes",
                    "Heart Disease",
                    "High Blood Pressure",
                    "HIV/AIDS",
                    "Hepatitis",
                    "Cancer",
                    "Blood Disorders",
                    "Respiratory Disease",
                  ].map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition}
                        checked={formData.healthConditions.includes(condition)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleHealthConditionToggle(condition)
                          } else {
                            handleHealthConditionToggle(condition)
                          }
                        }}
                      />
                      <Label htmlFor={condition}>{condition}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="medications">Are you currently taking any medications?</Label>
                <Input
                  id="medications"
                  name="medications"
                  placeholder="List medications (if any)"
                  value={formData.medications}
                  onChange={handleInputChange}
                />
              </div>
              {formData.gender === "female" && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pregnant"
                      checked={formData.pregnant}
                      onCheckedChange={(checked) => handleCheckboxChange("pregnant", !!checked)}
                    />
                    <Label htmlFor="pregnant">Are you pregnant or have you given birth in the last 6 months?</Label>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="recentSurgery"
                    checked={formData.recentSurgery}
                    onCheckedChange={(checked) => handleCheckboxChange("recentSurgery", !!checked)}
                  />
                  <Label htmlFor="recentSurgery">Have you had surgery in the last 6 months?</Label>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="recentTattoo"
                    checked={formData.recentTattoo}
                    onCheckedChange={(checked) => handleCheckboxChange("recentTattoo", !!checked)}
                  />
                  <Label htmlFor="recentTattoo">Have you had a tattoo in the last 6 months?</Label>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="recentPiercing"
                    checked={formData.recentPiercing}
                    onCheckedChange={(checked) => handleCheckboxChange("recentPiercing", !!checked)}
                  />
                  <Label htmlFor="recentPiercing">Have you had a piercing in the last 6 months?</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Previous
              </Button>
              <Button onClick={checkEligibility}>Check Eligibility</Button>
            </CardFooter>
          </>
        )
      case 3:
        return (
          <>
            <CardHeader>
              <CardTitle>Eligibility Result</CardTitle>
              <CardDescription>Based on the information provided, here is your eligibility status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result === "eligible" ? (
                <Alert className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <AlertTitle className="text-green-800 dark:text-green-400">
                    You are eligible to donate blood
                  </AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-500">
                    Based on the information you provided, you meet the eligibility criteria for blood donation. Please
                    schedule an appointment at your nearest blood donation center.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <AlertTitle className="text-red-800 dark:text-red-400">
                    You may not be eligible to donate blood at this time
                  </AlertTitle>
                  <AlertDescription className="text-red-700 dark:text-red-500">
                    <p className="mb-2">
                      Based on the information you provided, there are factors that may prevent you from donating blood
                      at this time:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      {reasons.map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    </ul>
                    <p className="mt-2">
                      Please consult with a healthcare professional or contact your local blood donation center for more
                      information.
                    </p>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Previous
              </Button>
              <Button onClick={() => setStep(1)}>Start Over</Button>
            </CardFooter>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Blood Donation Eligibility Checker</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Why Check Your Eligibility?</CardTitle>
            <CardDescription>Understanding blood donation requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Save Lives</h4>
                <p className="text-sm text-muted-foreground">
                  One donation can save up to three lives. Your contribution matters.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Basic Requirements</h4>
                <p className="text-sm text-muted-foreground">
                  Generally, donors must be at least 18 years old, weigh at least 50kg, and be in good health.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <AlertCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Temporary Deferrals</h4>
                <p className="text-sm text-muted-foreground">
                  Recent tattoos, piercings, surgeries, or certain medications may temporarily prevent donation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">{renderStep()}</Card>
      </div>
    </div>
  )
}
