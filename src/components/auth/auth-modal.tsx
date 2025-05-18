import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface AuthModalProps {
    children: React.ReactNode;
    type: "login" | "signup";
}

/**
 * Authentication Modal Component
 * 
 * This component handles:
 * - User type selection (customer/seller)
 * - Loading states during authentication
 * - Error handling
 * - Navigation to appropriate auth pages
 * 
 * @param {AuthModalProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const AuthModal = ({ children, type }: AuthModalProps) => {
    const { loading, error, login, signup } = useAuth();

    const handleAuth = async (userType: 'customer' | 'seller') => {
        try {
            if (type === 'login') {
                await login(userType);
            } else {
                await signup(userType);
            }
        } catch (err) {
            // Error is handled by the useAuth hook
            console.error('Authentication failed:', err);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <div className="flex flex-col items-center gap-8 py-4">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-semibold">
                            {type === "login" ? "Login" : "Sign up"}
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Start your shipping journey as
                        </p>
                    </div>

                    {error && (
                        <div className="w-full p-3 text-sm text-red-500 bg-red-50 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="flex w-full gap-4">
                        <Link 
                            to={`/customer/${type === "login" ? "login" : "register"}`} 
                            className="w-full"
                            onClick={(e) => {
                                e.preventDefault();
                                handleAuth('customer');
                            }}
                        >
                            <Button
                                variant="primary"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    'Customer'
                                )}
                            </Button>
                        </Link>
                        <Link 
                            to={`/seller/${type === "login" ? "login" : "register"}`} 
                            className="w-full"
                            onClick={(e) => {
                                e.preventDefault();
                                handleAuth('seller');
                            }}
                        >
                            <Button
                                variant="primary"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    'Seller'
                                )}
                            </Button>
                        </Link>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal; 