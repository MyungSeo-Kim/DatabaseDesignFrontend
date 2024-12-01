import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { User } from "../types";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiAtSign, FiLogOut, FiBookOpen } from "react-icons/fi";
import {
    PageContainer,
    Card,
    Title,
    Button,
    ErrorMessage,
} from "../components/StyledComponents";
import styled from "@emotion/styled";

const ProfileInfo = styled(motion.div)`
    background: #f7fafc;
    border-radius: 12px;
    padding: 1.5rem;
    margin: 1.5rem 0;
`;

const ProfileItem = styled.div`
    display: flex;
    align-items: center;
    margin: 1rem 0;
    padding: 0.75rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    svg {
        margin-right: 1rem;
        color: #4a5568;
    }

    strong {
        color: #2d3748;
        margin-right: 0.5rem;
    }

    span {
        color: #4a5568;
    }
`;

function Profile() {
    const { logout, user: authUser } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            if (!authUser?.id) return;

            try {
                const response = await fetch(
                    `https://doodler.gsong.workers.dev/api/users/profile/${authUser.id}`
                );
                const data = await response.json();

                if (data.success && data.result) {
                    setUser({
                        ...data.result.user,
                        id: authUser.id,
                        role:
                            data.result.user.role ||
                            authUser?.role ||
                            "student",
                    });
                } else {
                    setError(data.error || "프로필을 불러오는데 실패했습니다");
                }
            } catch {
                setError("서버 오류가 발생했습니다");
            }
        };

        fetchProfile();
    }, [authUser?.id]);

    return (
        <PageContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Card
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Title>내 프로필</Title>
                {error && (
                    <ErrorMessage
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {error}
                    </ErrorMessage>
                )}
                {user && (
                    <ProfileInfo
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <ProfileItem>
                            <FiUser size={20} />
                            <strong>이름:</strong>
                            <span>{user.name}</span>
                        </ProfileItem>
                        <ProfileItem>
                            <FiMail size={20} />
                            <strong>이메일:</strong>
                            <span>{user.email}</span>
                        </ProfileItem>
                        <ProfileItem>
                            <FiAtSign size={20} />
                            <strong>사용자명:</strong>
                            <span>{user.username}</span>
                        </ProfileItem>
                        <ProfileItem>
                            <FiBookOpen size={20} />
                            <strong>역할:</strong>
                            <span>
                                {user.role === "teacher" ? "선생님" : "학생"}
                            </span>
                        </ProfileItem>
                    </ProfileInfo>
                )}
                <Button
                    onClick={logout}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ background: "#e53e3e" }}
                >
                    <FiLogOut
                        style={{
                            marginRight: "0.5rem",
                            verticalAlign: "middle",
                        }}
                    />
                    로그아웃
                </Button>
            </Card>
        </PageContainer>
    );
}

export default Profile;
