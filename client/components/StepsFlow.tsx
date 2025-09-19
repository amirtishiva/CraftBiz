import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, BarChart3, Palette, MapPin, Megaphone, Rocket } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const steps = [
  { icon: Lightbulb, title: "Share Your Idea", desc: "Tell us your business concept in one line. Our AI understands your vision instantly." },
  { icon: BarChart3, title: "AI Business Planning", desc: "Get a comprehensive business plan with market analysis, financial projections, and strategy." },
  { icon: Palette, title: "Brand & Design", desc: "Create stunning logos and mockups with our AI design studio. See your brand come to life." },
  { icon: MapPin, title: "Find Local Suppliers", desc: "Connect with verified local dealers and suppliers in your city through our smart map." },
  { icon: Megaphone, title: "Marketing Kit", desc: "Generate platform‑specific content, hashtags, and promotional materials instantly." },
  { icon: Rocket, title: "Launch Ready", desc: "Export everything as a professional PDF and start your business journey today." },
] as const;

function ProgressPie({ value, size = 56, strokeWidth = 8 }: { value: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(value, 0), 1);
  const offset = circumference * (1 - clamped);
  return (
    <div className="relative" style={{ width: size, height: size }} aria-label={`Progress ${Math.round(clamped * 100)}%`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-muted-foreground">
        {Math.round(clamped * 100)}%
      </div>
    </div>
  );
}

export default function StepsFlow() {
  const [category, setCategory] = useState<"clothing" | "food" | "services" | "technology">("clothing");
  const [active, setActive] = useState(0);
  const progress = (active + 1) / steps.length;

  return (
    <section className="py-16 bg-background/80">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center">From idea to launch in 6 simple steps</h2>
        <p className="text-muted-foreground text-center mt-2 mb-10">Our intelligent workflow guides you through every aspect of starting your business.</p>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === active;
              const isDone = i < active;
              const number = `${(i + 1).toString().padStart(2, "0")}`;
              return (
                <div key={s.title} className="relative">
                  {isActive ? (
                    <Card className="shadow-md ring-1 ring-primary/20">
                      <CardContent className="p-5 flex gap-4 items-start cursor-pointer" onClick={() => setActive(i)}>
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">{s.title}</div>
                          <div className="text-sm text-muted-foreground mt-1">{s.desc}</div>
                        </div>
                        <div className="ml-auto text-sm text-muted-foreground/60 font-semibold">{number}</div>
                      </CardContent>
                    </Card>
                  ) : (
                    <button
                      className={`flex w-full text-left gap-4 items-start rounded-xl p-4 transition hover:bg-accent/40 ${isDone ? "opacity-100" : "opacity-90"}`}
                      onClick={() => setActive(i)}
                    >
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${isDone ? "bg-primary/10 text-primary" : "bg-muted text-foreground/80"}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">{s.title}</div>
                        <div className="text-sm text-muted-foreground mt-1 max-w-[46ch]">{s.desc}</div>
                      </div>
                      <div className="ml-auto text-sm text-muted-foreground/60 font-semibold">{number}</div>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="sticky top-6">
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {(() => { const Icon = steps[active].icon; return <Icon className="h-4 w-4" />; })()}
                    </span>
                    {steps[active].title}
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">Step {active + 1}/{steps.length}</span>
                    <ProgressPie value={progress} />
                  </div>
                </div>
                <CardDescription>{steps[active].desc}</CardDescription>
              </CardHeader>

              <AnimatePresence mode="wait">
                <motion.div key={active} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.35 }}>
                  <CardContent className="space-y-4">
                    {/** Right panel content varies by active step */}
                    {active === 0 && (
                      <div>
                        <Input placeholder="Describe your business idea in one line…" />
                        <div className="flex gap-2 mt-3">
                          <Button variant={category === "clothing" ? "default" : "outline"} size="sm" onClick={() => setCategory("clothing")}>Clothing</Button>
                          <Button variant={category === "food" ? "default" : "outline"} size="sm" onClick={() => setCategory("food")}>Food & Beverage</Button>
                          <Button variant={category === "services" ? "default" : "outline"} size="sm" onClick={() => setCategory("services")}>Services</Button>
                          <Button variant={category === "technology" ? "default" : "outline"} size="sm" onClick={() => setCategory("technology")}>Technology</Button>
                        </div>
                      </div>
                    )}

                    {active === 1 && (
                      <div className="space-y-4">
                        <div className="h-4 bg-muted rounded-full overflow-hidden">
                          <div style={{ width: "68%" }} className="h-full bg-primary transition-all" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-lg p-4 bg-green-50">
                            <div className="text-sm text-muted-foreground">Initial investment</div>
                            <div className="font-semibold text-lg">₹50K</div>
                          </div>
                          <div className="rounded-lg p-4 bg-purple-50">
                            <div className="text-sm text-muted-foreground">Break-even</div>
                            <div className="font-semibold text-lg">3-5 weeks</div>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">Business Plan Generated</div>
                      </div>
                    )}

                    {active === 2 && (
                      <div className="grid grid-cols-3 gap-3">
                        <div className="h-28 rounded-md bg-gradient-to-br from-purple-400 to-pink-400" />
                        <div className="h-28 rounded-md bg-gradient-to-br from-green-400 to-blue-400" />
                        <div className="h-28 rounded-md bg-gradient-to-br from-pink-400 to-purple-500" />
                        <div className="col-span-3 flex justify-between items-center mt-3">
                          <div className="text-sm text-muted-foreground">Mockups</div>
                          <Button size="sm">Preview</Button>
                        </div>
                      </div>
                    )}

                    {active === 3 && (
                      <div>
                        <div className="text-sm font-medium mb-2">Local Suppliers Found <span className="text-muted-foreground">12</span></div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between bg-green-50 rounded p-3">
                            <div>
                              <div className="font-medium">Print Palace</div>
                              <div className="text-xs text-muted-foreground">2.1km • 4.8★</div>
                            </div>
                            <button className="text-sm text-primary">Visit</button>
                          </div>
                          <div className="flex items-center justify-between bg-green-50 rounded p-3">
                            <div>
                              <div className="font-medium">Creative Prints</div>
                              <div className="text-xs text-muted-foreground">3.5km • 4.6★</div>
                            </div>
                            <button className="text-sm text-primary">Visit</button>
                          </div>
                        </div>
                      </div>
                    )}

                    {active === 4 && (
                      <div className="space-y-3">
                        <div className="bg-indigo-50 p-3 rounded">"Sustainable fashion that doesn't compromise…"</div>
                        <div className="flex gap-2">
                          <Button size="sm">Instagram</Button>
                          <Button size="sm">Youtube</Button>
                          <Button size="sm">Twitter</Button>
                          <Button size="sm">TikTok</Button>
                          <Button size="sm">#Hashtags</Button>
                        </div>
                        <div className="mt-2">
                          <Button className="rounded-full">Generate Poster</Button>
                        </div>
                      </div>
                    )}

                    {active === 5 && (
                      <div className="space-y-4">
                        <div className="p-4 rounded bg-green-50 text-center">
                          <div className="font-semibold">Business Kit Ready!</div>
                          <div className="text-sm text-muted-foreground">Everything compiled into a professional PDF</div>
                        </div>
                        <Button className="w-full">Download Complete Kit</Button>
                      </div>
                    )}
                  </CardContent>
                </motion.div>
              </AnimatePresence>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
