"use client";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Player } from "@lottiefiles/react-lottie-player";
import Animatedpayment from "./Animatedpayment.json";

export default function PaymentSuccessful() {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const searchParams = useSearchParams();

  const paymentStatus = searchParams.get("razorpay_payment_link_status");
  const paymentReferenceId = searchParams.get(
    "razorpay_payment_link_reference_id"
  );

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setProgress(100), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-green-100 dark:bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl bg-white  shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="flex flex-col items-center pt-8 pb-0">
          <div className="w-100 h-100 mb-4">
            <Player
              autoplay
              loop
              src={Animatedpayment}
              style={{ height: "100%", width: "100%" }}
            />
          </div>
          <h2 className="text-3xl font-bold text-green-700">
            Payment Successful!
          </h2>
        </CardHeader>
        <CardBody className="flex flex-col items-center gap-6 px-8">
          <p className="text-center text-gray-600 text-lg">
            Thank you for your purchase. Your order has been processed
            successfully.
          </p>
          <Card className="w-full bg-green-50 shadow-sm rounded-lg">
            <CardBody className="gap-4">
              <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
                Payment Details:
              </p>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Payment Status:
                </span>
                <span className="font-medium text-green-700 dark:text-green-300">
                  {paymentStatus}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Reference ID:
                </span>
                <span className="font-medium text-green-700 dark:text-green-300">
                  {paymentReferenceId}
                </span>
              </div>
            </CardBody>
          </Card>
        </CardBody>
        <Divider className="my-4" />
        <CardFooter className="flex justify-center pb-8">
          <Link href="/hospital-dashboard?page=jobs" passHref>
            <Button
              color="success"
              size="lg"
              className="font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors duration-300 shadow-md hover:shadow-lg rounded-md px-8 py-2"
            >
              Return to Jobs
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
