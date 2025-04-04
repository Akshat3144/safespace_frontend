import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  List,
  Eye,
  Clock,
  AlertTriangle,
  Map,
  LineChart,
  BadgeCheck,
} from "lucide-react";

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-lg mb-10">
        <div className="max-w-3xl">
          <div className="flex items-center mb-4">
            <Shield className="h-8 w-8 mr-3" />
            <h1 className="text-3xl font-bold">About SafeSpace</h1>
          </div>
          <p className="text-lg opacity-90 mb-6">
            SafeSpace is a revolutionary real estate platform that provides
            unparalleled transparency on environmental metrics, safety scores,
            and accessibility information to help you make informed decisions
            about your next home.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            In today's world, finding the right home means more than just
            looking at the number of bedrooms or the kitchen layout. It's about
            feeling safe and secure in your environment, understanding the
            health and wellness aspects of your neighborhood, and knowing your
            access to essential services.
          </p>
          <p className="text-gray-700 mb-6">
            At SafeSpace, we've leveraged advanced technology to create a
            transparent real estate platform that surfaces the critical safety,
            environmental, and accessibility information that traditional real
            estate applications often overlook.
          </p>
          <p className="text-gray-700">
            Our mission is to empower you with comprehensive data and insights
            so you can find a truly perfect home—one that meets your needs for
            safety, health, and accessibility.
          </p>
        </div>

        <Card className="bg-blue-50 border-0">
          <CardHeader>
            <CardTitle className="text-xl text-primary">
              Why SafeSpace is Different
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex">
                <Eye className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                <div>
                  <span className="font-medium block mb-1">
                    Complete Transparency
                  </span>
                  <span className="text-sm text-gray-600">
                    We provide data that other platforms hide or ignore, giving
                    you a complete picture of any property.
                  </span>
                </div>
              </li>
              <li className="flex">
                <Map className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                <div>
                  <span className="font-medium block mb-1">
                    Environmental Insights
                  </span>
                  <span className="text-sm text-gray-600">
                    Access air quality metrics, flood risks, and other
                    environmental data that affects your daily life.
                  </span>
                </div>
              </li>
              <li className="flex">
                <AlertTriangle className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                <div>
                  <span className="font-medium block mb-1">
                    Disaster Risk Assessment
                  </span>
                  <span className="text-sm text-gray-600">
                    Make informed decisions with detailed information about
                    potential natural disaster risks.
                  </span>
                </div>
              </li>
              <li className="flex">
                <Clock className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                <div>
                  <span className="font-medium block mb-1">
                    Emergency Response Times
                  </span>
                  <span className="text-sm text-gray-600">
                    Know how quickly emergency services can reach your potential
                    home in case of need.
                  </span>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-6">Our Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardContent className="pt-6">
            <div className="rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
              <BadgeCheck className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Safety Scores</h3>
            <p className="text-gray-600">
              Each property is assigned a safety score based on multiple factors
              including crime rates, emergency response times, and proximity to
              emergency services.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
              <LineChart className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Human Development Index
            </h3>
            <p className="text-gray-600">
              Understand the quality of life in different neighborhoods with our
              HDI analysis that measures health, education, and standard of
              living.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="rounded-full bg-amber-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
              <Map className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Interactive Map View</h3>
            <p className="text-gray-600">
              Explore properties and their surrounding areas with our
              interactive map that highlights safety zones, risk areas, and
              important amenities.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-12">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Our Data Sources</h2>
          <p className="text-gray-700 mb-6">
            At SafeSpace, we believe in providing the most accurate and
            up-to-date information. Our data is sourced from:
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start">
              <List className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <span className="text-gray-700">
                Official government safety and environmental reports
              </span>
            </li>
            <li className="flex items-start">
              <List className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <span className="text-gray-700">
                Real-time air quality monitoring systems
              </span>
            </li>
            <li className="flex items-start">
              <List className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <span className="text-gray-700">
                Emergency services response time databases
              </span>
            </li>
            <li className="flex items-start">
              <List className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <span className="text-gray-700">
                FEMA flood and disaster risk assessments
              </span>
            </li>
            <li className="flex items-start">
              <List className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <span className="text-gray-700">
                United Nations Human Development Index reports
              </span>
            </li>
            <li className="flex items-start">
              <List className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <span className="text-gray-700">
                Accessibility compliance databases and regulations
              </span>
            </li>
          </ul>
          <p className="text-gray-700">
            Our data is refreshed regularly to ensure you're making decisions
            based on the most current information available.
          </p>
        </div>
      </div>

      <div className="p-8 bg-neutral-100 rounded-lg mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Our Team</h2>
          <p className="text-gray-700 mb-6">
            SafeSpace was created by a team of engineers majoring in Computer
            Science and Artificial Intelligence who recognized the need for
            greater transparency in the real estate market.
          </p>
          <p className="text-gray-700">
            We're passionate about using technology to solve real-world problems
            and help people make better decisions about one of the most
            important aspects of their lives—where they live.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
