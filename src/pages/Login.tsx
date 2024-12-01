import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LoginResponse } from "../types";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import {
    PageContainer,
    Card,
    Title,
    Input,
    Button,
    ErrorMessage,
    LinkText,
} from "../components/StyledComponents";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch(
                "https://doodler.gsong.workers.dev/api/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                }
            );

            const data: LoginResponse = await response.json();

            if (data.success && data.result) {
                login(data.result.user);
                navigate("/main", { replace: true });
            } else {
                setError(data.error || "로그인에 실패했습니다");
            }
        } catch (err) {
            console.error(err);
            setError("서버 오류가 발생했습니다");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Card
                variant="auth"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Title>로그인</Title>
                {error && (
                    <ErrorMessage
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {error}
                    </ErrorMessage>
                )}
                <form onSubmit={handleSubmit}>
                    <div style={{ position: "relative" }}>
                        <FiMail
                            style={{
                                position: "absolute",
                                top: "1.1rem",
                                left: "1rem",
                                color: "#4a5568",
                            }}
                        />
                        <Input
                            type="email"
                            placeholder="이메일"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ paddingLeft: "2.5rem" }}
                            required
                        />
                    </div>
                    <div style={{ position: "relative" }}>
                        <FiLock
                            style={{
                                position: "absolute",
                                top: "1.1rem",
                                left: "1rem",
                                color: "#4a5568",
                            }}
                        />
                        <Input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ paddingLeft: "2.5rem" }}
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isLoading ? (
                            "로그인 중..."
                        ) : (
                            <>
                                <FiLogIn
                                    style={{
                                        marginRight: "0.5rem",
                                        verticalAlign: "middle",
                                    }}
                                />
                                로그인
                            </>
                        )}
                    </Button>
                </form>
                <LinkText>
                    계정이 없으신가요? <Link to="/register">회원가입</Link>
                </LinkText>
            </Card>
        </PageContainer>
    );
}

export default Login;
