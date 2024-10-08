"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { signIn, signUp } from "@/lib/actions/user.actions";
import { authFormSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomInput from "./CustomInput";
import PlaidLink from "./PlaidLink";

const AuthForm = ({ type }: { type: string }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const formSchema = authFormSchema(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        const userData = {
            email: data.email!,
            password: data.password!,
            address1: data.address1!,
            city: data.city!,
            dateOfBirth: data.dateOfBirth!,
            firstName: data.firstName!,
            lastName: data.lastName!,
            postalCode: data.postalCode!,
            ssn: data.ssn!,
            state: data.state!,
        };
        try {
            if (type === "sign-up") {
                const newUser = await signUp(userData);
                setUser(newUser);
            }

            if (type === "sign-in") {
                const response = await signIn({
                    email: data.email,
                    password: data.password,
                });
                if (response) router.push("/");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <section className="auth-form">
            <header className="flex flex-col gap-5 max-md:gap-8">
                <Link
                    href="/"
                    className="cursor-pointer items-center gap-1 flex"
                >
                    <Image
                        src="/icons/logo.svg"
                        width={34}
                        height={34}
                        alt="Horizon Logo"
                    />
                    <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
                        Horizon
                    </h1>
                </Link>
                <div className="flex flex-col gap-1 max-md:gap-3">
                    <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
                        {user
                            ? "Link Account"
                            : type === "sign-in"
                            ? "Sign In"
                            : "Sign Up"}
                        <p className="text-16 font-normal text-gray-600">
                            {user
                                ? "Link Your account to get started"
                                : "Please enter your details."}
                        </p>
                    </h1>
                </div>
            </header>
            {user ? (
                <div className="flex flex-col gap-4">
                    <PlaidLink user={user} variant="primary" />
                </div>
            ) : (
                <>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            {type === "sign-up" && (
                                <>
                                    <div className="flex gap-5">
                                        <CustomInput
                                            control={form.control}
                                            name="firstName"
                                            label="First Name"
                                            placeholder="Enter your first name"
                                            type="text"
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name="lastName"
                                            label="Last Name"
                                            placeholder="Enter your last name"
                                            type="text"
                                        />
                                    </div>
                                    <CustomInput
                                        control={form.control}
                                        name="address1"
                                        label="Address"
                                        placeholder="Enter your specific address"
                                        type="text"
                                    />
                                    <CustomInput
                                        control={form.control}
                                        name="city"
                                        label="City"
                                        placeholder="Enter your City"
                                        type="text"
                                    />
                                    <div className="flex gap-5">
                                        <CustomInput
                                            control={form.control}
                                            name="state"
                                            label="State"
                                            placeholder="Example: NY"
                                            type="text"
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name="postalCode"
                                            label="Postal Code"
                                            placeholder="Example: 10001"
                                            type="text"
                                        />
                                    </div>
                                    <div className="flex gap-5">
                                        <CustomInput
                                            control={form.control}
                                            name="dateOfBirth"
                                            label="Date of Birth"
                                            placeholder="YYYY-MMMM-DDDD"
                                            type="text"
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name="ssn"
                                            label="SSN"
                                            placeholder="Example: 1234"
                                            type="text"
                                        />
                                    </div>
                                </>
                            )}
                            <CustomInput
                                control={form.control}
                                name="email"
                                label="Email"
                                placeholder="Enter your email"
                                type="email"
                            />
                            <CustomInput
                                control={form.control}
                                name="password"
                                label="Password"
                                placeholder="Enter your password"
                                type="password"
                            />
                            <div className="flex flex-col gap-4">
                                <Button
                                    type="submit"
                                    className="form-btn"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2
                                                size={20}
                                                className="animate-spin"
                                            />
                                            &nbsp;Loading...
                                        </>
                                    ) : type === "sign-in" ? (
                                        "Sign In"
                                    ) : (
                                        "Sign Up"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <footer className="flex justify-center gap-1">
                        <p className="text-14 font-normal text-gray-600">
                            {type === "sign-in"
                                ? "Don't have an account?"
                                : "Already have an account?"}
                        </p>
                        <Link
                            href={type === "sign-in" ? "/sign-up" : "/sign-in"}
                            className="form-link"
                        >
                            {type === "sign-in" ? "Sign Up" : "Sign In"}
                        </Link>
                    </footer>
                </>
            )}
        </section>
    );
};

export default AuthForm;
