import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiBookOpen, FiUsers, FiPlus, FiSearch, FiUser } from "react-icons/fi";
import {
    PageContainer,
    Card,
    Button,
    ContentWrapper,
} from "../components/StyledComponents";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const ActionGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin: 2rem 0;
`;

const ActionCard = styled(motion.div)`
    background: white;
    border-radius: 15px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    svg {
        font-size: 2.5rem;
        color: #667eea;
        margin-bottom: 1rem;
    }

    h3 {
        color: #2d3748;
        margin-bottom: 1rem;
        font-size: 1.5rem;
    }

    p {
        color: #718096;
        line-height: 1.6;
    }
`;

const WelcomeSection = styled.div`
    text-align: center;
    margin-bottom: 3rem;

    h1 {
        color: #2d3748;
        font-size: 2.5rem;
        margin-bottom: 1rem;
    }

    p {
        color: #4a5568;
        font-size: 1.2rem;
    }
`;

const RoleTag = styled.span`
    display: inline-block;
    padding: 0.5rem 1rem;
    background: #ebf4ff;
    color: #4c51bf;
    border-radius: 20px;
    font-size: 0.9rem;
    margin-top: 1rem;
`;

interface Group {
    id: number;
    name: string;
    description: string;
    teacher_name: string;
    student_count: number;
    assignment_count: number;
    completed_assignments?: number;
    completion_rate?: number;
}

// 테스트 데이터 수정
const mockGroups: Group[] = [
    {
        id: 1,
        name: "중등 영어 기초반",
        description: "중학교 1-2학년 대상 기초 영어 수업입니다.",
        teacher_name: "김영희 선생님",
        student_count: 5,
        assignment_count: 8,
        completed_assignments: 6,
        completion_rate: 75,
    },
    {
        id: 2,
        name: "고등 수학 심화반",
        description: "고등학교 수학 심화 과정입니다.",
        teacher_name: "박철수 선생님",
        student_count: 3,
        assignment_count: 12,
        completed_assignments: 8,
        completion_rate: 66.7,
    },
    {
        id: 3,
        name: "초등 과학 실험반",
        description: "초등학생 대상 과학 실험 수업입니다.",
        teacher_name: "이미영 선생님",
        student_count: 8,
        assignment_count: 6,
        completed_assignments: 4,
        completion_rate: 66.7,
    },
];

// 새로운 스타일 컴포넌트 추가
const GroupList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
`;

const GroupCard = styled(motion.div)`
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    h3 {
        color: #2d3748;
        margin-bottom: 0.5rem;
    }

    p {
        color: #718096;
        font-size: 0.9rem;
        margin-bottom: 1rem;
    }

    .meta {
        display: flex;
        justify-content: space-between;
        color: #4a5568;
        font-size: 0.9rem;
    }

    .teacher {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
`;

// 새로운 스타일 컴포넌트 추가
const LessonModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e2e8f0;

        h2 {
            margin: 0;
            color: #2d3748;
            font-size: 1.5rem;
        }
    }

    .close-button {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #4a5568;
        padding: 0.5rem;

        &:hover {
            color: #2d3748;
        }
    }
`;

// 새로운 스타일 컴포넌트 추가
const JoinGroupModal = styled(ModalContent)`
    max-width: 500px;

    .join-input {
        margin: 2rem 0;

        label {
            display: block;
            margin-bottom: 0.5rem;
            color: #4a5568;
            font-weight: 600;
        }

        input {
            width: 100%;
            padding: 1rem;
            font-size: 1.2rem;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            text-align: center;
            letter-spacing: 2px;
            font-family: monospace;
            text-transform: uppercase;

            &:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
        }
    }

    .error-message {
        color: #e53e3e;
        margin-top: 0.5rem;
        font-size: 0.9rem;
    }
`;

function MainPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [myGroups, setMyGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const isTeacher = user?.role === "teacher";

    // 참여중인 수업방 모달 상태 추가
    const [showGroupsModal, setShowGroupsModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinCode, setJoinCode] = useState("");
    const [joinError, setJoinError] = useState("");

    useEffect(() => {
        // API 호출 대신 테스트 데이터 사용
        const fetchMyGroups = async () => {
            try {
                // 약간의 로딩 시간을 시뮬레이션
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setMyGroups(mockGroups);
            } catch (error) {
                console.error("그룹 목록을 불러오는데 실패했습니다:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyGroups();
    }, []);

    // 그룹 클릭 핸들러 추가
    const handleGroupClick = (groupId: number) => {
        navigate(`/groups/${groupId}`);
    };

    // 모달 컴포넌트
    const GroupsModal = () => (
        <LessonModal onClick={() => setShowGroupsModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>참여중인 수업방</h2>
                    <button
                        className="close-button"
                        onClick={() => setShowGroupsModal(false)}
                    >
                        ×
                    </button>
                </div>
                <GroupList>
                    {myGroups.map((group) => (
                        <GroupCard
                            key={group.id}
                            onClick={() => {
                                handleGroupClick(group.id);
                                setShowGroupsModal(false);
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <h3>{group.name}</h3>
                            <p>{group.description}</p>
                            <div className="meta">
                                <div className="teacher">
                                    <FiUser />
                                    {group.teacher_name}
                                </div>
                                <div>
                                    진도율:{" "}
                                    {Math.round(group.completion_rate || 0)}%
                                </div>
                            </div>
                        </GroupCard>
                    ))}
                </GroupList>
            </ModalContent>
        </LessonModal>
    );

    // 참여 코드 입력 모달 컴포넌트
    const JoinGroupModalComponent = () => (
        <LessonModal onClick={() => setShowJoinModal(false)}>
            <JoinGroupModal onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>수업방 참여하기</h2>
                    <button
                        className="close-button"
                        onClick={() => setShowJoinModal(false)}
                    >
                        ×
                    </button>
                </div>

                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                            // API 호출하여 참여 코드 확인
                            // const response = await fetch(...);
                            // if (success) navigate(`/groups/${groupId}`);

                            // 테스트용 코드
                            if (joinCode.toUpperCase() === "ABCD1234") {
                                navigate("/groups/1");
                            } else {
                                setJoinError("잘못된 참여 코드입니다.");
                            }
                        } catch (error) {
                            setJoinError(
                                "참여 중 오류가 발생했습니다." + error
                            );
                        }
                    }}
                >
                    <div className="join-input">
                        <label>참여 코드 입력</label>
                        <input
                            type="text"
                            value={joinCode}
                            onChange={(e) => {
                                setJoinError("");
                                setJoinCode(e.target.value.toUpperCase());
                            }}
                            placeholder="ABCD1234"
                            maxLength={8}
                            required
                        />
                        {joinError && (
                            <div className="error-message">{joinError}</div>
                        )}
                    </div>

                    <Button type="submit">참여하기</Button>
                </form>
            </JoinGroupModal>
        </LessonModal>
    );

    return (
        <PageContainer>
            <ContentWrapper>
                <Card>
                    <WelcomeSection>
                        <h1>안녕하세요, {user?.name}님!</h1>
                        <p>
                            {isTeacher
                                ? "과외 수업방을 만들고 관리해보세요"
                                : "원하는 과외 수업방에 참여해보세요"}
                        </p>
                        <RoleTag>{isTeacher ? "선생님" : "학생"} 계정</RoleTag>
                    </WelcomeSection>

                    <ActionGrid>
                        {isTeacher ? (
                            <>
                                <ActionCard
                                    onClick={() => navigate("/groups/create")}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <FiPlus />
                                    <h3>과외 수업방 만들기</h3>
                                    <p>
                                        새로운 과외 수업방을 만들고 학생들을
                                        모집해보세요
                                    </p>
                                </ActionCard>
                                <ActionCard
                                    onClick={() =>
                                        handleGroupClick(mockGroups[0].id)
                                    }
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <FiBookOpen />
                                    <h3>
                                        내 과외 수업방{" "}
                                        {!loading && `(${myGroups.length})`}
                                    </h3>
                                    <p>
                                        {loading
                                            ? "로딩 중..."
                                            : `${myGroups.length}개의 수업방을 운영 중입니다`}
                                    </p>
                                    {!loading && myGroups.length > 0 && (
                                        <p>
                                            총 학생 수:{" "}
                                            {myGroups.reduce(
                                                (sum, group) =>
                                                    sum + group.student_count,
                                                0
                                            )}
                                            명
                                        </p>
                                    )}
                                </ActionCard>
                            </>
                        ) : (
                            <>
                                <ActionCard
                                    onClick={() => setShowJoinModal(true)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <FiSearch />
                                    <h3>과외 수업방 찾기</h3>
                                    <p>
                                        참여 코드를 입력하여 수업방에 참여하세요
                                    </p>
                                </ActionCard>
                                <ActionCard
                                    onClick={() => setShowGroupsModal(true)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <FiUsers />
                                    <h3>
                                        참여 중인 수업방{" "}
                                        {!loading && `(${myGroups.length})`}
                                    </h3>
                                    <p>
                                        {loading
                                            ? "로딩 중..."
                                            : `${myGroups.length}개의 수업방에 참여 중입니다`}
                                    </p>
                                    {!loading && myGroups.length > 0 && (
                                        <p>
                                            평균 과제 완료율:{" "}
                                            {Math.round(
                                                myGroups.reduce(
                                                    (acc, group) =>
                                                        acc +
                                                        (group.completion_rate ||
                                                            0),
                                                    0
                                                ) / myGroups.length
                                            )}
                                            %
                                        </p>
                                    )}
                                </ActionCard>
                            </>
                        )}
                    </ActionGrid>

                    <Button onClick={() => navigate("/profile")}>
                        프로필 관리
                    </Button>
                </Card>
            </ContentWrapper>

            {/* 참여중인 수업방 모달 */}
            {showGroupsModal && <GroupsModal />}
            {showJoinModal && <JoinGroupModalComponent />}
        </PageContainer>
    );
}

export default MainPage;
