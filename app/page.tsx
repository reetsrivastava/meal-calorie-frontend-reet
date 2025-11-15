"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/auth";
import Image from "next/image";

export default function Home() {
	const router = useRouter();
	const token = useAuthStore((s) => s.token);

	const handleGetStarted = () => {
		if (token) {
			router.push("/dashboard");
		} else {
			router.push("/login");
		}
	};

	const handleHistory = () => {
		if (token) {
			router.push("/history");
		} else {
			router.push("/login");
		}
	};

	return (
		<div className="flex flex-1 items-center justify-center px-4 py-20">
				<div className="mx-auto w-full max-w-2xl text-center">
					<h1 className="mb-4 text-5xl font-bold tracking-tight">
						CaloWise
					</h1>
					<p className="mb-8 text-xl text-muted-foreground">
						Your smart meal calorie counter for healthier living
					</p>
					<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
						<Button
							onClick={handleGetStarted}
							size="lg"
							className="text-lg px-8 py-6"
						>
							Get Started
						</Button>
						{token && (
							<Button
								onClick={handleHistory}
								size="lg"
								variant="outline"
								className="text-lg px-8 py-6"
							>
								History
							</Button>
						)}
					</div>
					<div className="flex justify-center">
						<Image
							src="/home.svg"
							alt="CaloWise illustration"
							width={600}
							height={200}
							className="w-full max-w-2xl h-auto"
							priority
						/>
					</div>
				</div>
		</div>
	);
}
