import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RegisterResponse, UserRole } from "../types";
import {
    FiMail,
    FiLock,
    FiUser,
    FiUserPlus,
    FiShield,
    FiBookOpen,
} from "react-icons/fi";
import {
    PageContainer,
    Card,
    Title,
    Input,
    Button,
    ErrorMessage,
    LinkText,
} from "../components/StyledComponents";
import styled from "@emotion/styled";

const RoleSelector = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 1.2rem;
`;

const RoleButton = styled.button<{ isSelected: boolean }>`
    flex: 1;
    padding: 1rem;
    border: 2px solid ${(props) => (props.isSelected ? "#667eea" : "#e2e8f0")};
    border-radius: 12px;
    background: ${(props) =>
        props.isSelected ? "rgba(102, 126, 234, 0.1)" : "white"};
    color: ${(props) => (props.isSelected ? "#667eea" : "#4a5568")};
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &:hover {
        border-color: #667eea;
        background: ${(props) =>
            props.isSelected
                ? "rgba(102, 126, 234, 0.1)"
                : "rgba(102, 126, 234, 0.05)"};
    }
`;

function Register() {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        passwordConfirm: "",
        name: "",
        role: "" as UserRole,
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRoleSelect = (role: UserRole) => {
        setFormData((prev) => ({
            ...prev,
            role,
        }));
    };

    const validateForm = () => {
        if (formData.password !== formData.passwordConfirm) {
            setError("비밀번호가 일치하지 않습니다");
            return false;
        }
        if (!formData.role) {
            setError("역할을 선택해주세요");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const { passwordConfirm, ...submitData } = formData;

            console.log(passwordConfirm);
            const response = await fetch(
                "https://doodler.gsong.workers.dev/api/users/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(submitData),
                }
            );

            const data: RegisterResponse = await response.json();

            if (data.success && data.result) {
                navigate("/login");
            } else {
                setError(data.error || "회원가입에 실패했습니다");
            }
        } catch {
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
                <Title>회원가입</Title>
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
                            name="email"
                            placeholder="이메일"
                            value={formData.email}
                            onChange={handleChange}
                            style={{ paddingLeft: "2.5rem" }}
                            required
                        />
                    </div>
                    <div style={{ position: "relative" }}>
                        <FiUser
                            style={{
                                position: "absolute",
                                top: "1.1rem",
                                left: "1rem",
                                color: "#4a5568",
                            }}
                        />
                        <Input
                            type="text"
                            name="username"
                            placeholder="사용자명"
                            value={formData.username}
                            onChange={handleChange}
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
                            name="password"
                            placeholder="비밀번호"
                            value={formData.password}
                            onChange={handleChange}
                            style={{ paddingLeft: "2.5rem" }}
                            required
                            minLength={6}
                        />
                    </div>
                    <div style={{ position: "relative" }}>
                        <FiShield
                            style={{
                                position: "absolute",
                                top: "1.1rem",
                                left: "1rem",
                                color: "#4a5568",
                            }}
                        />
                        <Input
                            type="password"
                            name="passwordConfirm"
                            placeholder="비밀번호 확인"
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                            style={{ paddingLeft: "2.5rem" }}
                            required
                            minLength={6}
                        />
                    </div>
                    <div style={{ position: "relative" }}>
                        <FiUser
                            style={{
                                position: "absolute",
                                top: "1.1rem",
                                left: "1rem",
                                color: "#4a5568",
                            }}
                        />
                        <Input
                            type="text"
                            name="name"
                            placeholder="이름"
                            value={formData.name}
                            onChange={handleChange}
                            style={{ paddingLeft: "2.5rem" }}
                            required
                        />
                    </div>
                    <RoleSelector>
                        <RoleButton
                            type="button"
                            isSelected={formData.role === "student"}
                            onClick={() => handleRoleSelect("student")}
                        >
                            <FiUser /> 학생
                        </RoleButton>
                        <RoleButton
                            type="button"
                            isSelected={formData.role === "teacher"}
                            onClick={() => handleRoleSelect("teacher")}
                        >
                            <FiBookOpen /> 선생님
                        </RoleButton>
                    </RoleSelector>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isLoading ? (
                            "처리 중..."
                        ) : (
                            <>
                                <FiUserPlus
                                    style={{
                                        marginRight: "0.5rem",
                                        verticalAlign: "middle",
                                    }}
                                />
                                회원가입
                            </>
                        )}
                    </Button>
                </form>
                <LinkText>
                    이미 계정이 있으신가요? <Link to="/login">로그인</Link>
                </LinkText>
            </Card>
        </PageContainer>
    );
}

export default Register;
