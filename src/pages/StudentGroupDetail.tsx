import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiArrowLeft, FiBook, FiCalendar } from "react-icons/fi";
import {
    PageContainer,
    Card,
    Title,
    Button,
    ErrorMessage,
    ContentWrapper,
} from "../components/StyledComponents";
import styled from "@emotion/styled";

const BackButton = styled(Button)`
    width: auto;
    padding: 0.8rem 1.5rem;
    background: transparent;
    color: #4a5568;
    border: 2px solid #e2e8f0;

    &:hover {
        background: #f7fafc;
        color: #2d3748;
    }
`;

// const LessonCard = styled.div`
//     background: white;
//     border: 1px solid #e2e8f0;
//     border-radius: 12px;
//     padding: 1.5rem;
//     margin-bottom: 1rem;
//     transition: all 0.2s;

//     &:hover {
//         box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
//     }

//     .lesson-header {
//         display: flex;
//         justify-content: space-between;
//         align-items: center;
//         margin-bottom: 1rem;
//         padding-bottom: 1rem;
//         border-bottom: 1px solid #e2e8f0;

//         h3 {
//             margin: 0;
//             color: #2d3748;
//         }

//         .date {
//             color: #718096;
//             font-size: 0.9rem;
//             display: flex;
//             align-items: center;
//             gap: 0.5rem;
//         }
//     }
// `;

const AssignmentCard = styled.div`
    background: #f8fafc;
    border-radius: 8px;
    padding: 1rem;
    margin-top: 1rem;

    .assignment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .assignment-title {
        font-weight: 600;
        color: #2d3748;
    }

    .assignment-meta {
        display: flex;
        gap: 1rem;
        font-size: 0.9rem;
        color: #718096;
        margin-bottom: 0.5rem;
    }

    .assignment-description {
        color: #4a5568;
        font-size: 0.95rem;
        margin-bottom: 1rem;
    }
`;

const StatusButton = styled(Button)<{ completed: boolean }>`
    background: ${(props) => (props.completed ? "#48BB78" : "#E2E8F0")};
    color: ${(props) => (props.completed ? "white" : "#4A5568")};
    padding: 0.3rem 0.8rem;
    font-size: 0.85rem;
    min-width: 60px;

    &:hover {
        background: ${(props) => (props.completed ? "#38A169" : "#CBD5E0")};
    }
`;

// 인터페이스 정의
interface StudentGroupData {
    group: {
        id: number;
        name: string;
        description: string;
        teacher_name: string;
    };
    lesson_records: {
        id: number;
        date: string;
        title: string;
        description: string;
        learning_contents: {
            topic: string;
            details: string;
            materials?: string;
            objectives?: string[];
        }[];
        assignments: {
            id: number;
            title: string;
            description: string;
            type: string;
            due_date: string;
            is_completed: boolean;
        }[];
        gpt_summary?: string;
        questions?: {
            id: number;
            student_name: string;
            question: string;
            created_at: string;
        }[];
    }[];
}

const LessonListItem = styled.div`
    padding: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    margin-bottom: 0.5rem;
    cursor: pointer;
    background: white;
    transition: all 0.2s ease;

    &:hover {
        background: #f7fafc;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .lesson-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .lesson-title {
        font-weight: 600;
        color: #2d3748;
    }

    .lesson-date {
        color: #718096;
        font-size: 0.9rem;
    }
`;

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
const QuestionSection = styled.div`
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e2e8f0;
`;

const QuestionInput = styled.div`
    margin-bottom: 2rem;

    textarea {
        width: 100%;
        padding: 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        margin-bottom: 1rem;
        min-height: 100px;
        resize: vertical;
        font-size: 0.95rem;

        &:focus {
            outline: none;
            border-color: #4299e1;
            box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
        }
    }
`;

const QuestionList = styled.div`
    .question-item {
        background: #f8fafc;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;

        .question-header {
            display: flex;
            justify-content: space-between;
            color: #718096;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }

        .question-content {
            color: #2d3748;
            margin-bottom: 1rem;
        }

        .answer {
            background: white;
            padding: 1rem;
            border-radius: 6px;
            border-left: 3px solid #4299e1;
            color: #4a5568;
        }
    }
`;

function StudentGroupDetail() {
    const [groupData, setGroupData] = useState<StudentGroupData | null>(null);
    const [error, setError] = useState("");
    const [selectedLesson, setSelectedLesson] = useState<any>(null);
    const { user } = useAuth();
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [newQuestion, setNewQuestion] = useState("");

    const fetchGroupDetails = async () => {
        try {
            // 실제 API 호출 대신 테스트 데이터 사용
            const mockData: StudentGroupData = {
                group: {
                    id: 1,
                    name: "중등 영어 기초반",
                    description: "중학교 1-2학년 대상 기초 영어 수업입니다.",
                    teacher_name: "김영희 선생님",
                },
                lesson_records: [
                    {
                        id: 1,
                        date: "2024-03-15",
                        title: "기본 문법 - be동사",
                        description:
                            "be동사의 현재형과 과거형, 미래형에 대해 학습했습니다.",
                        gpt_summary:
                            "이번 수업에서는 be동사의 기본 개념과 활용을 다뤘습니다. am, is, are의 현재형을 학습하고, 주어에 따른 올바른 be동사 선택 방법을 익혔습니다. 학생들은 짝 활동을 통해 실제 대화에서 be동사를 활용하는 연습을 했으며, 특히 의문문과 부정문 만들기에 중점을 두었습니다.",
                        learning_contents: [
                            {
                                topic: "be동사의 현재형",
                                details: "am, is, are의 사용법과 문장 구조",
                                materials: "영문법 기초 교재 p.24-28",
                                objectives: [
                                    "be동사의 세 가지 형태를 구분할 수 있다",
                                    "주어에 맞는 be동사를 선택할 수 있다",
                                ],
                            },
                            {
                                topic: "be동사 의문문/부정문",
                                details:
                                    "be동사를 사용한 의문문과 부정문 만들기",
                                materials: "학습지, PPT",
                                objectives: [
                                    "be동사로 의문문을 만들 수 있다",
                                    "be동사로 부정문을 만들 수 있다",
                                ],
                            },
                        ],
                        assignments: [
                            {
                                id: 1,
                                title: "be동사 문제집",
                                description: "중학영문법 기초 24-35페이지",
                                type: "문제집",
                                due_date: "2024-03-18",
                                is_completed: false,
                            },
                            {
                                id: 2,
                                title: "영작문 숙제",
                                description: "자기소개 영작문 작성하기",
                                type: "작문",
                                due_date: "2024-03-20",
                                is_completed: true,
                            },
                        ],
                    },
                    {
                        id: 2,
                        date: "2024-03-13",
                        title: "현재진행형",
                        description:
                            "be동사와 현재분사를 활용한 현재진행형 학습",
                        gpt_summary:
                            "현재진행형의 구조(be동사 + 현재분사)를 배우고, 동사의 현재분사 변화 규칙을 학습했습니다. 특히 'running', 'swimming'과 같은 기본 동사와 'studying', 'lying'과 같은 특수한 변화 규칙을 집중적으로 다뤘습니다. 학생들은 실생활에서 자주 사용되는 상황을 통해 현재진행형을 연습했습니다.",
                        learning_contents: [
                            {
                                topic: "현재분사 만들기",
                                details: "동사의 현재분사 변화 규칙 학습",
                                materials: "영문법 기초 교재 p.30-32",
                                objectives: [
                                    "일반 동사의 현재분사를 만들 수 있다",
                                    "특수한 변화 규칙을 이해하고 적용할 수 있다",
                                ],
                            },
                            {
                                topic: "현재진행형 문장",
                                details:
                                    "be동사와 현재분사를 결합한 현재진행형 문장 만들기",
                                materials: "실전 문제집 p.15-18",
                                objectives: [
                                    "현재진행형 긍정문을 만들 수 있다",
                                    "현재진행형 의문문과 부정문을 만들 수 있다",
                                ],
                            },
                        ],
                        assignments: [
                            {
                                id: 1,
                                title: "현재진행형 문제집",
                                description: "중학영문법 기초 24-35페이지",
                                type: "문제집",
                                due_date: "2024-03-18",
                                is_completed: false,
                            },
                            {
                                id: 2,
                                title: "현재진행형 숙제",
                                description: "현재진행형 문장 작성하기",
                                type: "작문",
                                due_date: "2024-03-20",
                                is_completed: true,
                            },
                        ],
                    },
                    {
                        id: 3,
                        date: "2024-03-10",
                        title: "Reading Comprehension - Daily Life",
                        description: "일상생활 관련 지문 읽기와 이해",
                        gpt_summary:
                            "일상생활을 주제로 한 지문을 통해 관련 어휘와 표현을 학습했습니다. 특히 시간 표현과 일과를 나타내는 동사들을 중점적으로 다뤘으며, 스키밍과 스캐닝 독해 전략을 연습했습니다. 학생들은 자신의 일상을 영어로 표현하는 활동을 통해 학습 내용을 실제로 활용해보았습니다.",
                        learning_contents: [
                            {
                                topic: "핵심 어휘",
                                details: "일상생활 관련 주요 단어와 표현",
                                materials: "Reading Explorer 1 p.20-22",
                                objectives: [
                                    "일상생활 관련 어휘를 익힐 수 있다",
                                    "시간 표현을 이해하고 사용할 수 있다",
                                ],
                            },
                            {
                                topic: "독해 전략",
                                details: "스키밍과 스캐닝 연습",
                                materials: "독해 전략 워크북",
                                objectives: [
                                    "글의 주제를 빠게 파악할 수 있다",
                                    "필요한 정보를 정확히 찾을 수 있다",
                                ],
                            },
                        ],
                        assignments: [
                            {
                                id: 1,
                                title: "일상생활 지문 읽기",
                                description: "일상생활 관련 지문 읽기와 이해",
                                type: "지문 읽기",
                                due_date: "2024-03-18",
                                is_completed: false,
                            },
                            {
                                id: 2,
                                title: "일상생활 숙제",
                                description: "일상생활 관련 숙제 작성하기",
                                type: "작문",
                                due_date: "2024-03-20",
                                is_completed: true,
                            },
                        ],
                    },
                ],
            };

            setGroupData(mockData);
        } catch (err) {
            setError("데이터를 불러오는 중 오류가 발생했습니다." + err);
        }
    };

    useEffect(() => {
        if (user?.id && groupId) {
            fetchGroupDetails();
        }
    }, [groupId, user?.id]);

    const handleToggleAssignment = async (assignmentId: number) => {
        try {
            // 실제 API 호출 구현
            // const response = await fetch(`/api/assignments/${assignmentId}/toggle`, ...);

            // 임시로 상태 업데이트
            setGroupData((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    lesson_records: prev.lesson_records.map((lesson) => ({
                        ...lesson,
                        assignments: lesson.assignments.map((assignment) =>
                            assignment.id === assignmentId
                                ? {
                                      ...assignment,
                                      is_completed: !assignment.is_completed,
                                  }
                                : assignment
                        ),
                    })),
                };
            });
        } catch (err) {
            setError("과제 상태를 변경하는 중 오류가 발생했습니다." + err);
        }
    };

    const handleCloseModal = () => {
        setSelectedLesson(null);
    };

    const handleAddQuestion = async () => {
        if (!newQuestion.trim() || !selectedLesson) return;

        try {
            // 실제 API 호출 대신 임시 데이터 추가
            const newQuestionData = {
                id: Date.now(),
                student_name: user?.name || "학생",
                question: newQuestion,
                created_at: new Date().toISOString(),
            };

            setGroupData((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    lesson_records: prev.lesson_records.map((lesson) =>
                        lesson.id === selectedLesson.id
                            ? {
                                  ...lesson,
                                  questions: [
                                      ...(lesson.questions || []),
                                      newQuestionData,
                                  ],
                              }
                            : lesson
                    ),
                };
            });

            setNewQuestion("");
        } catch (err) {
            setError("질문을 등록하는 중 오류가 발생했습니다." + err);
        }
    };

    if (!groupData) {
        return (
            <PageContainer>
                <ContentWrapper>
                    <Card>
                        {error ? (
                            <ErrorMessage>{error}</ErrorMessage>
                        ) : (
                            <Title>로딩 중...</Title>
                        )}
                    </Card>
                </ContentWrapper>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <ContentWrapper>
                <Card>
                    <BackButton onClick={() => navigate("/groups")}>
                        <FiArrowLeft /> 목록으로
                    </BackButton>

                    <Title style={{ marginTop: "2rem" }}>
                        수업 기록 및 과제
                    </Title>

                    {/* 수업 목록 */}
                    {groupData.lesson_records.map((lesson) => (
                        <LessonListItem
                            key={lesson.id}
                            onClick={() => setSelectedLesson(lesson)}
                        >
                            <div className="lesson-header">
                                <span className="lesson-title">
                                    {lesson.title}
                                </span>
                                <span className="lesson-date">
                                    {new Date(lesson.date).toLocaleDateString()}
                                </span>
                            </div>
                        </LessonListItem>
                    ))}

                    {/* 수업 상세 모달 */}
                    {selectedLesson && (
                        <LessonModal onClick={handleCloseModal}>
                            <ModalContent onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h2>{selectedLesson.title}</h2>
                                    <button
                                        className="close-button"
                                        onClick={handleCloseModal}
                                    >
                                        ×
                                    </button>
                                </div>

                                <p style={{ background: "#f8fafc" }}>
                                    {selectedLesson.description}
                                </p>

                                {selectedLesson.gpt_summary && (
                                    <div
                                        style={{
                                            background: "#f0fdf4",
                                            padding: "1rem",
                                            borderRadius: "8px",
                                            marginBottom: "1rem",
                                        }}
                                    >
                                        <h4
                                            style={{
                                                color: "#166534",
                                                marginBottom: "0.5rem",
                                            }}
                                        >
                                            GPT 수업 요약
                                        </h4>
                                        <p style={{ color: "#166534" }}>
                                            {selectedLesson.gpt_summary}
                                        </p>
                                    </div>
                                )}

                                {/* 학습 내용 섹션 */}
                                {selectedLesson.learning_contents && (
                                    <div
                                        style={{
                                            background: "#f8fafc",
                                            padding: "1rem",
                                            borderRadius: "8px",
                                            marginBottom: "1.5rem",
                                        }}
                                    >
                                        <h4 style={{ marginBottom: "1rem" }}>
                                            학습 내용
                                        </h4>
                                        {selectedLesson.learning_contents.map(
                                            (content: any, index: number) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        marginBottom: "1rem",
                                                        paddingBottom: "1rem",
                                                        borderBottom:
                                                            index !==
                                                            selectedLesson
                                                                .learning_contents
                                                                .length -
                                                                1
                                                                ? "1px solid #e2e8f0"
                                                                : "none",
                                                    }}
                                                >
                                                    <h5
                                                        style={{
                                                            color: "#2d3748",
                                                            marginBottom:
                                                                "0.5rem",
                                                        }}
                                                    >
                                                        {content.topic}
                                                    </h5>
                                                    <p
                                                        style={{
                                                            color: "#4a5568",
                                                            marginBottom:
                                                                "0.5rem",
                                                        }}
                                                    >
                                                        {content.details}
                                                    </p>
                                                    {content.materials && (
                                                        <p
                                                            style={{
                                                                color: "#718096",
                                                                fontSize:
                                                                    "0.9rem",
                                                            }}
                                                        >
                                                            학습 자료:{" "}
                                                            {content.materials}
                                                        </p>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}

                                {/* 과제 섹션 */}
                                <div style={{ marginTop: "1.5rem" }}>
                                    <h4 style={{ marginBottom: "1rem" }}>
                                        과제
                                    </h4>
                                    {selectedLesson.assignments.map(
                                        (assignment: any) => (
                                            <AssignmentCard key={assignment.id}>
                                                <div className="assignment-header">
                                                    <span className="assignment-title">
                                                        {assignment.title}
                                                    </span>
                                                    <StatusButton
                                                        completed={
                                                            assignment.is_completed
                                                        }
                                                        onClick={() =>
                                                            handleToggleAssignment(
                                                                assignment.id
                                                            )
                                                        }
                                                    >
                                                        {assignment.is_completed
                                                            ? "완료"
                                                            : "미완료"}
                                                    </StatusButton>
                                                </div>
                                                <div className="assignment-meta">
                                                    <span>
                                                        <FiBook />{" "}
                                                        {assignment.type}
                                                    </span>
                                                    <span>
                                                        <FiCalendar /> 마감:{" "}
                                                        {new Date(
                                                            assignment.due_date
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="assignment-description">
                                                    {assignment.description}
                                                </div>
                                            </AssignmentCard>
                                        )
                                    )}
                                </div>

                                {/* 질문 섹션 추가 */}
                                <QuestionSection>
                                    <h4 style={{ marginBottom: "1rem" }}>
                                        질문하기
                                    </h4>
                                    <QuestionInput>
                                        <textarea
                                            placeholder="수업 내용에 대해 궁금한 점을 질문해보세요..."
                                            value={newQuestion}
                                            onChange={(e) =>
                                                setNewQuestion(e.target.value)
                                            }
                                        />
                                        <Button
                                            onClick={handleAddQuestion}
                                            disabled={!newQuestion.trim()}
                                            style={{
                                                opacity: !newQuestion.trim()
                                                    ? 0.5
                                                    : 1,
                                            }}
                                        >
                                            질문 등록
                                        </Button>
                                    </QuestionInput>

                                    {selectedLesson.questions &&
                                        selectedLesson.questions.length > 0 && (
                                            <QuestionList>
                                                <h4
                                                    style={{
                                                        marginBottom: "1rem",
                                                    }}
                                                >
                                                    나의 질문 목록
                                                </h4>
                                                {selectedLesson.questions
                                                    .filter(
                                                        (q: any) =>
                                                            q.student_name ===
                                                            user?.name
                                                    )
                                                    .map((question: any) => (
                                                        <div
                                                            key={question.id}
                                                            className="question-item"
                                                        >
                                                            <div className="question-header">
                                                                <span>
                                                                    {new Date(
                                                                        question.created_at
                                                                    ).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            <div className="question-content">
                                                                {
                                                                    question.question
                                                                }
                                                            </div>
                                                            {question.answer && (
                                                                <div className="answer">
                                                                    <div
                                                                        style={{
                                                                            fontSize:
                                                                                "0.9rem",
                                                                            color: "#718096",
                                                                            marginBottom:
                                                                                "0.5rem",
                                                                        }}
                                                                    >
                                                                        선생님
                                                                        답변:
                                                                    </div>
                                                                    {
                                                                        question.answer
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                            </QuestionList>
                                        )}
                                </QuestionSection>
                            </ModalContent>
                        </LessonModal>
                    )}
                </Card>
            </ContentWrapper>
        </PageContainer>
    );
}

export default StudentGroupDetail;
