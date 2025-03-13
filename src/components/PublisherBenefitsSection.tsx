import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, BarChart, Shield, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const PublisherBenefitsSection = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">For Publishers</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Replace intrusive ads with AI training tasks and
          <span className="text-primary font-semibold"> increase revenue by 10-15x</span>
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Increased Revenue</CardTitle>
            <CardDescription>
              Generate 10-15x more revenue compared to traditional ads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              HotLabel tasks provide significantly higher value than display ads. A single AI training task can be worth 10-15 times more than a traditional ad impression.
            </p>
          </CardContent>
          <CardFooter>
            <div className="flex items-center text-sm text-primary">
              <span className="font-medium">$0.03 vs $0.002</span>
              <span className="ml-2 text-xs text-muted-foreground">per impression</span>
            </div>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Improved User Experience</CardTitle>
            <CardDescription>
              Users prefer interactive tasks over intrusive ads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Replace annoying popup ads with engaging micro-tasks. Users spend more time on your site, leading to higher engagement rates and better retention.
            </p>
          </CardContent>
          <CardFooter>
            <div className="flex items-center text-sm text-primary">
              <span className="font-medium">+270% user satisfaction</span>
              <span className="ml-2 text-xs text-muted-foreground">in A/B tests</span>
            </div>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <BarChart className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Detailed Analytics</CardTitle>
            <CardDescription>
              Comprehensive insights into performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Get detailed analytics on task completion rates, user engagement, and revenue metrics. Make data-driven decisions to optimize your implementation.
            </p>
          </CardContent>
          <CardFooter>
            <div className="flex items-center text-sm text-primary">
              <span className="font-medium">Real-time dashboard</span>
              <span className="ml-2 text-xs text-muted-foreground">with KPIs</span>
            </div>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>5-Minute Integration</CardTitle>
            <CardDescription>
              Quick and hassle-free implementation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our lightweight SDK can be implemented in just 5 minutes. Simply add a small script to your site and tag your existing ad containers - no complex setup required.
            </p>
          </CardContent>
          <CardFooter>
            <div className="flex items-center text-sm text-primary">
              <span className="font-medium">Just 5 lines of code</span>
              <span className="ml-2 text-xs text-muted-foreground">to get started</span>
            </div>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Enhanced Privacy</CardTitle>
            <CardDescription>
              No personal data collection or tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              HotLabel respects user privacy by not collecting personally identifiable information. Our system uses contextual matching without invasive tracking.
            </p>
          </CardContent>
          <CardFooter>
            <div className="flex items-center text-sm text-primary">
              <span className="font-medium">GDPR & CCPA compliant</span>
              <span className="ml-2 text-xs text-muted-foreground">by design</span>
            </div>
          </CardFooter>
        </Card>
        
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-primary-foreground">Try the 5-Minute Timer Demo</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              See how quickly you can integrate HotLabel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-primary-foreground/80">
              Our interactive demo walks you through replacing traditional ads with HotLabel in under 5 minutes, showing exactly how simple the integration process is.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/integration-timer">
              <Button variant="secondary" className="w-full group">
                Start the demo
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      <div className="flex flex-col items-center justify-center max-w-3xl mx-auto">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-xl"></div>
          <img 
            src="/placeholder.svg" 
            alt="Publisher Revenue Chart" 
            className="relative rounded-lg shadow-lg" 
            width={600} 
            height={320}
          />
        </div>
        
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to boost your revenue?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            Join thousands of publishers who have already increased their revenue and improved user experience with HotLabel.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="group">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Link to="/integration-timer">
              <Button variant="outline" size="lg">
                See Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PublisherBenefitsSection;