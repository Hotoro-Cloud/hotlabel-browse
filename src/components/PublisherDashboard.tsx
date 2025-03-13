import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { ArrowUpRight, TrendingUp, DollarSign, Users, CreditCard, Activity, Info, Filter, ArrowDown, ArrowUp } from "lucide-react";

const revenueData = [
  { name: 'Jan', traditional: 1200, hotlabel: 13800 },
  { name: 'Feb', traditional: 1300, hotlabel: 14950 },
  { name: 'Mar', traditional: 1250, hotlabel: 14375 },
  { name: 'Apr', traditional: 1400, hotlabel: 16100 },
  { name: 'May', traditional: 1350, hotlabel: 15525 },
  { name: 'Jun', traditional: 1450, hotlabel: 16675 },
  { name: 'Jul', traditional: 1500, hotlabel: 17250 },
];

const userExperienceData = [
  { name: 'Jan', traditional: 5.2, hotlabel: 8.7 },
  { name: 'Feb', traditional: 5.1, hotlabel: 8.9 },
  { name: 'Mar', traditional: 5.3, hotlabel: 9.0 },
  { name: 'Apr', traditional: 5.0, hotlabel: 9.1 },
  { name: 'May', traditional: 5.2, hotlabel: 9.2 },
  { name: 'Jun', traditional: 5.1, hotlabel: 9.3 },
  { name: 'Jul', traditional: 5.0, hotlabel: 9.4 },
];

const tasksCompletedData = [
  { name: 'Mon', count: 320 },
  { name: 'Tue', count: 380 },
  { name: 'Wed', count: 425 },
  { name: 'Thu', count: 400 },
  { name: 'Fri', count: 450 },
  { name: 'Sat', count: 380 },
  { name: 'Sun', count: 350 },
];

const taskTypeData = [
  { name: 'Image Classification', value: 35 },
  { name: 'Text Classification', value: 25 },
  { name: 'VQA', value: 30 },
  { name: 'True/False', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  trend: number;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, description, trend, icon }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-4 w-4 text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      <div className={`flex items-center pt-1 text-xs ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
        {trend > 0 ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
        {Math.abs(trend)}% from last month
      </div>
    </CardContent>
  </Card>
);

const PublisherDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-1">Publisher Dashboard</h2>
          <p className="text-muted-foreground">
            Performance metrics after integrating HotLabel
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 rounded-full px-3 py-1 text-sm font-medium text-primary flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            Integration Active
          </div>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>
      
      {/* Time period selector */}
      <div className="flex justify-end">
        <TabsList>
          <TabsTrigger 
            value="1d" 
            onClick={() => setSelectedPeriod("1d")}
            className={selectedPeriod === "1d" ? "bg-primary text-primary-foreground" : ""}
          >
            Day
          </TabsTrigger>
          <TabsTrigger 
            value="7d" 
            onClick={() => setSelectedPeriod("7d")}
            className={selectedPeriod === "7d" ? "bg-primary text-primary-foreground" : ""}
          >
            Week
          </TabsTrigger>
          <TabsTrigger 
            value="30d" 
            onClick={() => setSelectedPeriod("30d")}
            className={selectedPeriod === "30d" ? "bg-primary text-primary-foreground" : ""}
          >
            Month
          </TabsTrigger>
          <TabsTrigger 
            value="ytd" 
            onClick={() => setSelectedPeriod("ytd")}
            className={selectedPeriod === "ytd" ? "bg-primary text-primary-foreground" : ""}
          >
            Year
          </TabsTrigger>
        </TabsList>
      </div>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value="$16,675"
          description="Total revenue this month"
          trend={15.3}
          icon={<DollarSign className="h-4 w-4" />}
        />
        
        <StatCard
          title="RPM Increase"
          value="1,150%"
          description="Revenue per mille compared to ads"
          trend={7.2}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        
        <StatCard
          title="User Experience"
          value="9.3/10"
          description="Average user satisfaction score"
          trend={5.6}
          icon={<Users className="h-4 w-4" />}
        />
        
        <StatCard
          title="Total Tasks"
          value="2,715"
          description="Tasks completed this month"
          trend={12.5}
          icon={<Activity className="h-4 w-4" />}
        />
      </div>
      
      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Revenue Comparison</CardTitle>
            <CardDescription>HotLabel vs. Traditional Ads</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="traditional" 
                  stroke="#8884d8" 
                  name="Traditional Ads" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="hotlabel" 
                  stroke="#82ca9d" 
                  name="HotLabel" 
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Revenue is consistently 11-12x higher with HotLabel integration
          </CardFooter>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Experience Score</CardTitle>
            <CardDescription>HotLabel vs. Traditional Ads</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userExperienceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="traditional" 
                  stroke="#ff7979" 
                  name="Traditional Ads" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="hotlabel" 
                  stroke="#82ca9d" 
                  name="HotLabel" 
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            User experience scores are 80% higher with HotLabel
          </CardFooter>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Tasks Completed (Last 7 Days)</CardTitle>
            <CardDescription>Daily completion rate</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tasksCompletedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Average of 386 tasks completed daily
          </CardFooter>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Task Type Distribution</CardTitle>
            <CardDescription>By category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Image classification is the most common task type
          </CardFooter>
        </Card>
      </div>
      
      {/* Recent activity table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Task Activity</CardTitle>
          <CardDescription>
            Latest completed tasks across your network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-5 border-b bg-muted/50 p-3 text-sm font-medium">
              <div>Time</div>
              <div>Task Type</div>
              <div>User ID</div>
              <div>Duration</div>
              <div>Quality Score</div>
            </div>
            <div className="divide-y">
              <div className="grid grid-cols-5 items-center p-3 text-sm">
                <div className="text-muted-foreground">Just now</div>
                <div>Image Classification</div>
                <div className="font-mono text-xs">user_8a72b3</div>
                <div>3.2s</div>
                <div className="flex items-center text-green-500">
                  0.92
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </div>
              </div>
              <div className="grid grid-cols-5 items-center p-3 text-sm">
                <div className="text-muted-foreground">2 mins ago</div>
                <div>VQA</div>
                <div className="font-mono text-xs">user_7c91a5</div>
                <div>4.8s</div>
                <div className="flex items-center text-green-500">
                  0.89
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </div>
              </div>
              <div className="grid grid-cols-5 items-center p-3 text-sm">
                <div className="text-muted-foreground">5 mins ago</div>
                <div>Text Classification</div>
                <div className="font-mono text-xs">user_3e45d7</div>
                <div>2.5s</div>
                <div className="flex items-center text-green-500">
                  0.95
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </div>
              </div>
              <div className="grid grid-cols-5 items-center p-3 text-sm">
                <div className="text-muted-foreground">12 mins ago</div>
                <div>True/False</div>
                <div className="font-mono text-xs">user_9f23c1</div>
                <div>1.8s</div>
                <div className="flex items-center text-amber-500">
                  0.78
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </div>
              </div>
              <div className="grid grid-cols-5 items-center p-3 text-sm">
                <div className="text-muted-foreground">18 mins ago</div>
                <div>Image Classification</div>
                <div className="font-mono text-xs">user_5k82p9</div>
                <div>2.9s</div>
                <div className="flex items-center text-green-500">
                  0.91
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="ml-auto">
            View all activity
          </Button>
        </CardFooter>
      </Card>
      
      {/* Implementation details */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Implementation Details
          </CardTitle>
          <CardDescription>
            Your HotLabel integration is working correctly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-2">Active SDK Version</h4>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full px-2 py-1 text-xs font-medium">
                  v1.2.3
                </div>
                <span className="text-xs text-muted-foreground">Latest version</span>
              </div>
              
              <h4 className="font-semibold mb-2">Implementation Status</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">SDK Correctly Installed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">Ad Containers Properly Tagged</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">Server Connection Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">Events Correctly Firing</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Implementation Code</h4>
              <div className="bg-black text-white p-4 rounded-md text-xs font-mono overflow-auto">
                <pre>{`<!-- HotLabel SDK -->
<script src="https://cdn.hotlabel.ai/sdk/v1/hotlabel.min.js"></script>
<script>
  window.HotLabel.init({
    publisherId: "your-publisher-id",
    adSlotSelector: ".ad-container",
    apiEndpoint: "https://api.hotlabel.ai/v1",
    theme: "light" // or "dark"
  });
</script>`}</pre>
              </div>
              
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Container Example</h4>
                <div className="bg-black text-white p-4 rounded-md text-xs font-mono overflow-auto">
                  <pre>{`<div class="ad-container">
  <!-- HotLabel tasks will appear here -->
</div>`}</pre>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm">
            View Documentation
          </Button>
          <Button variant="default" size="sm" className="ml-2">
            Update SDK
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PublisherDashboard;