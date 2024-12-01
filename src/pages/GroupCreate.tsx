import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { CreateGroupResponse } from "../types";
import { FiBook, FiFileText } from "react-icons/fi";
import {
    PageContainer,
    Card,
    Title,
    Input,
    Button,
    ErrorMessage,
    ContentWrapper,
} from "../components/StyledComponents";
import styled from "@emotion/styled";

const TextArea = styled.textarea`
    width: 100%;
    padding: 1.2rem;
    margin-bottom: 1.2rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    background: white;
    box-sizing: border-box;
    color: #2d3748;
    min-height: 150px;
    resize: vertical;

    &::placeholder {
        color: #a0aec0;
    }

    &:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
`;

function GroupCreate() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) {
            setError("로그인이 필요합니다");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await fetch(
                "https://doodler.gsong.workers.dev/api/groups",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...formData,
                        user_id: user.id,
                    }),
                }
            );

            const data: CreateGroupResponse = await response.json();

            if (data.success && data.result) {
                navigate(`/groups/${data.result.group.id}`);
            } else {
                setError(
                    data.error ||
                        "수업방 생성에 실패했습니다. 선생님만 수업방을 만들 수 있습니다."
                );
            }
        } catch {
            setError("서버 오류가 발생했습니다");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageContainer>
            <ContentWrapper>
                <Card
                    variant="auth"
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Title>새 스터디 수업방 만들기</Title>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <form onSubmit={handleSubmit}>
                        <div style={{ position: "relative" }}>
                            <FiBook
                                style={{
                                    position: "absolute",
                                    top: "1.1rem",
                                    left: "1rem",
                                    color: "#4a5568",
                                }}
                            />
                            <Input
                                type="text"
                                placeholder="수업방 이름"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                                style={{ paddingLeft: "2.5rem" }}
                                required
                            />
                        </div>
                        <div style={{ position: "relative" }}>
                            <FiFileText
                                style={{
                                    position: "absolute",
                                    top: "1.1rem",
                                    left: "1rem",
                                    color: "#4a5568",
                                }}
                            />
                            <TextArea
                                placeholder="수업방 설명"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
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
                            {isLoading ? "생성 중..." : "수업방 만들기"}
                        </Button>
                    </form>
                </Card>
            </ContentWrapper>
        </PageContainer>
    );
}

export default GroupCreate;
