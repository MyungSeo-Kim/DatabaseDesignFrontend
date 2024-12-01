import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { GroupWithMembers, GroupListResponse } from "../types";
import { FiSearch, FiPlus, FiUsers, FiLock, FiUnlock } from "react-icons/fi";
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
import { motion } from "framer-motion";

const SearchBar = styled.div`
    position: relative;
    margin-bottom: 2rem;
`;

const GroupGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
`;

const GroupCard = styled(motion.div)`
    background: white;
    border-radius: 15px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
    cursor: pointer;

    &:hover {
        transform: translateY(-5px);
    }
`;

const GroupHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
`;

const GroupName = styled.h3`
    margin: 0;
    color: #2d3748;
    font-size: 1.25rem;
`;

const GroupMeta = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    color: #718096;
    font-size: 0.9rem;
`;

const GroupDescription = styled.p`
    color: #4a5568;
    margin: 1rem 0;
    line-height: 1.5;
`;

function GroupList() {
    const [groups, setGroups] = useState<GroupWithMembers[]>([]);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    console.log(isLoading);
    const fetchGroups = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `https://doodler.gsong.workers.dev/api/groups?search=${search}`
            );
            const data: GroupListResponse = await response.json();

            if (data.success && data.result) {
                setGroups(data.result.groups);
            } else {
                setError(data.error || "수업방을 가져오는데 실패했습니다");
            }
        } catch (err) {
            console.error(err);
            setError("서버 오류가 발생했습니다");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, [search, user?.id]);

    return (
        <PageContainer>
            <ContentWrapper>
                <Card>
                    <Title>스터디 수업방</Title>
                    {error && <ErrorMessage>{error}</ErrorMessage>}

                    <SearchBar>
                        <FiSearch
                            style={{
                                position: "absolute",
                                top: "1.1rem",
                                left: "1rem",
                                color: "#4a5568",
                            }}
                        />
                        <Input
                            type="text"
                            placeholder="수업방 검색..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ paddingLeft: "2.5rem" }}
                        />
                    </SearchBar>

                    <Button
                        onClick={() => navigate("/groups/create")}
                        style={{ marginBottom: "2rem" }}
                    >
                        <FiPlus /> 새 수업방 만들기
                    </Button>

                    <GroupGrid>
                        {groups.map((group) => (
                            <GroupCard
                                key={group.id}
                                onClick={() => navigate(`/groups/${group.id}`)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <GroupHeader>
                                    <GroupName>{group.name}</GroupName>
                                    {group.is_public ? (
                                        <FiUnlock />
                                    ) : (
                                        <FiLock />
                                    )}
                                </GroupHeader>
                                <GroupDescription>
                                    {group.description}
                                </GroupDescription>
                                <GroupMeta>
                                    <span>
                                        <FiUsers /> {group.member_count} 멤버
                                    </span>
                                    {group.is_member && (
                                        <span>
                                            {group.role === "owner"
                                                ? "관리자"
                                                : "멤버"}
                                        </span>
                                    )}
                                </GroupMeta>
                            </GroupCard>
                        ))}
                    </GroupGrid>
                </Card>
            </ContentWrapper>
        </PageContainer>
    );
}

export default GroupList;
