import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import Cookies from "js-cookie";
import { User } from "../types";

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 쿠키 관련 상수
const USER_COOKIE_KEY = "auth_user";
const COOKIE_EXPIRES = 7; // 7일 후 만료

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = Cookies.get(USER_COOKIE_KEY);
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // 사용자 정보 검증
    useEffect(() => {
        console.log("user: ", user);
        const validateUser = async () => {
            if (user?.id) {
                try {
                    const response = await fetch(
                        `https://doodler.gsong.workers.dev/api/users/profile/${user.id}`
                    );
                    const data = await response.json();

                    console.log("data: ", data);
                    if (data.success && data.result) {
                        // 기존 user 정보 유지하면서 새로운 정보로 업데이트
                        const currentUser =
                            user ||
                            JSON.parse(Cookies.get(USER_COOKIE_KEY) || "{}");
                        const updatedUser = {
                            ...currentUser,
                            ...data.result.user,
                            // id: currentUser.id, // ID는 기존 값 유지
                            // role: data.result.user.role || currentUser.role, // role 정보 업데이트
                        };

                        setUser(updatedUser);
                        // 쿠키도 업데이트
                        Cookies.set(
                            USER_COOKIE_KEY,
                            JSON.stringify(updatedUser),
                            {
                                expires: COOKIE_EXPIRES,
                            }
                        );
                    } else {
                        logout();
                    }
                } catch {
                    logout();
                }
            }
        };

        validateUser();
    }, [user?.id]);

    const login = (user: User) => {
        console.log("login: ", user);
        setUser(user);
        Cookies.set(USER_COOKIE_KEY, JSON.stringify(user), {
            expires: COOKIE_EXPIRES,
        });
    };

    const logout = () => {
        setUser(null);
        Cookies.remove(USER_COOKIE_KEY);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
