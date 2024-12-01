import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
// import { GroupDetailResponse } from "../types";
import { FiUsers, FiArrowLeft, FiUser } from "react-icons/fi";
import {
    PageContainer,
    Card,
    Title,
    Button,
    ErrorMessage,
    ContentWrapper,
    ProfileItem,
} from "../components/StyledComponents";
import styled from "@emotion/styled";

const GroupHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
`;

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

const GroupMeta = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    color: #4a5568;
    font-size: 1.1rem;

    svg {
        vertical-align: middle;
    }
`;

const JoinCodeSection = styled.div`
    background: #f7fafc;
    border: 1px dashed #4a5568;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .code {
        font-family: monospace;
        font-size: 1.2rem;
        color: #2d3748;
        font-weight: bold;
        letter-spacing: 2px;
    }

    .copy-button {
        padding: 0.5rem 1rem;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9rem;

        &:hover {
            background: #5a67d8;
        }
    }
`;

const GroupDescription = styled.p`
    color: #4a5568;
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: #f7fafc;
    border-radius: 12px;
`;

const MembersList = styled.div`
    margin: 1rem 0 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
`;

const MemberCard = styled(ProfileItem)`
    background: white;
    padding: 1rem;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.5rem;
    transition: all 0.2s;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .member-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #e2e8f0;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.5rem;

        svg {
            color: #4a5568;
            font-size: 1.2rem;
        }
    }

    .member-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.2rem;

        .name {
            font-weight: 600;
            color: #2d3748;
        }

        .username {
            font-size: 0.9rem;
            color: #718096;
        }
    }
`;

// const AssignmentList = styled.div`
//     margin-top: 2rem;
// `;

const AssignmentCard = styled.div`
    background: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .assignment-info {
        h4 {
            margin: 0;
            color: #2d3748;
        }
        p {
            margin: 0.5rem 0 0;
            color: #4a5568;
        }
    }

    .completion-info,
    .completion-status {
        color: #4a5568;
        font-size: 0.9rem;
    }

    .completion-info {
        cursor: help;
    }
`;

// 새로운 타입 정의
interface StudentProgress {
    email: string;
    username: string;
    name: string;
    completed_assignments: number;
    total_assignments: number;
    completion_rate: number;
}

interface Assignment {
    id: number;
    title: string;
    description: string;
    completed_students?: number;
    total_students?: number;
    completion_rate?: number;
    is_completed?: boolean;
    student_status?: {
        student_id: number;
        name: string;
        completed: boolean;
    }[];
}

interface GroupDetails {
    id: number;
    name: string;
    description: string;
    teacher_id: number;
    teacher_name: string;
    student_count: number;
    assignment_count: number;
    created_at: string;
    updated_at: string;
}

interface LessonRecord {
    id: number;
    date: string;
    title: string;
    description: string;
    learning_contents: {
        topic: string;
        details: string;
        materials?: string;
    }[];
    assignments: Assignment[];
    gpt_summary?: string;
    questions?: {
        id: number;
        student_name: string;
        question: string;
        answer?: string;
        created_at: string;
    }[];
}

interface GroupDetailData {
    group: GroupDetails;
    students: StudentProgress[];
    lesson_records: LessonRecord[];
}

// 새로운 스타일 컴포넌트 추가
const LessonRecordSection = styled.div`
    margin-top: 2rem;
`;

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
    padding: 2.5rem;
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
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e2e8f0;

        h2 {
            color: #2d3748;
            margin: 0;
        }
    }

    .form-group {
        margin-bottom: 1.5rem;

        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #4a5568;
        }

        input,
        textarea,
        select {
            width: 100%;
            padding: 0.8rem;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            font-size: 1rem;
            color: #2d3748;
            background: #f8fafc;
            transition: all 0.2s;

            &:focus {
                outline: none;
                border-color: #4299e1;
                box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
            }
        }

        textarea {
            min-height: 100px;
            resize: vertical;
        }

        select {
            appearance: none;
            background-image: url("data:image/svg+xml,...");
            background-repeat: no-repeat;
            background-position: right 0.5rem center;
            padding-right: 2rem;
        }
    }

    .activity-group {
        background: #f8fafc;
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        border: 1px solid #e2e8f0;

        input,
        textarea {
            margin-bottom: 0.8rem;
            background: white;
        }
    }
`;

const AssignmentSection = styled.div`
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
`;

const AddButton = styled(Button)`
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    background: #4caf50;

    &:hover {
        background: #45a049;
    }
`;

// const CompletionTooltip = styled.div`
//     position: absolute;
//     top: calc(100% + 10px);
//     right: 0;
//     background: white;
//     border: 1px solid #e2e8f0;
//     border-radius: 8px;
//     padding: 1rem;
//     box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//     z-index: 100;
//     min-width: 200px;
//     display: none;

//     // 툴팁 화살표
//     &:before {
//         content: "";
//         position: absolute;
//         top: -8px;
//         right: 20px;
//         width: 0;
//         height: 0;
//         border-left: 8px solid transparent;
//         border-right: 8px solid transparent;
//         border-bottom: 8px solid white;
//     }
// `;

// const CompletionWrapper = styled.div`
//     position: relative;

//     &:hover ${CompletionTooltip} {
//         display: block;
//     }
// `;

// const StudentStatus = styled.div`
//     margin: 0.5rem 0;
//     padding: 0.5rem;
//     border-radius: 4px;

//     &.completed {
//         color: #2f855a;
//         background: #f0fff4;
//     }

//     &.incomplete {
//         color: #c53030;
//         background: #fff5f5;
//     }
// `;

const LessonContents = styled.div`
    margin: 1rem 0;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 8px;

    h4 {
        margin: 0 0 0.5rem 0;
        color: #2d3748;
    }

    .content-item {
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e2e8f0;

        &:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }
    }

    .topic {
        font-weight: 600;
        color: #4a5568;
        margin-bottom: 0.3rem;
    }

    .details {
        color: #718096;
        font-size: 0.95rem;
    }

    .materials {
        margin-top: 0.3rem;
        font-size: 0.9rem;
        color: #2b6cb0;
    }
`;

// learning_contents 타입 수정
// interface LearningContent {
//     topic: string;
//     details: string;
//     materials?: string;
//     objectives: string[];
//     activities: {
//         name: string;
//         duration: string;
//         description: string;
//     }[];
//     homework_preparation?: string;
//     notes?: string;
// }

// 새로운 모달 컴포넌트들
const LessonModalContent = styled(ModalContent)`
    h3 {
        margin-bottom: 1rem;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
    }

    input,
    textarea {
        width: 100%;
        padding: 0.8rem;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        margin-bottom: 0.5rem;
    }

    .activity-group {
        background: #f8fafc;
        padding: 1rem;
        border-radius: 6px;
        margin-bottom: 1rem;
    }

    .objective-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .objective-tag {
        background: #e2e8f0;
        padding: 0.3rem 0.8rem;
        border-radius: 20px;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        button {
            background: none;
            border: none;
            color: #4a5568;
            cursor: pointer;
            padding: 0;
            font-size: 1.2rem;
            line-height: 1;
        }
    }
`;

// 테스트 데이터의 learning_contents 수정 예시
const mockLessonContent = {
    topic: "be동사의 현재형",
    details: "am, is, are의 사용법과 문장 구조에 대한 학습",
    materials: "영문법 기초 교재 p.24-28, 학습지, PPT",
    objectives: [
        "be동사의 세 가지 형태(am/is/are)를 구분하여 사용할 수 있다",
        "주어에 따른 적절한 be동사를 선택할 수 있다",
        "be동사를 활용한 긍정문을 만들 수 있다",
    ],
    activities: [
        {
            name: "워밍업",
            duration: "10분",
            description: "전 시간 배운 내용 복습 및 퀴즈",
        },
        {
            name: "주요 개념 설명",
            duration: "20분",
            description: "be동사의 세 가지 형태와 사용법 설명, 예문 분석",
        },
        {
            name: "짝 활동",
            duration: "15분",
            description: "주어진 상황에 맞는 be동사 사용하여 대화하기",
        },
        {
            name: "개별 연습",
            duration: "15분",
            description: "학습지를 통한 개별 연습 및 피드백",
        },
    ],
    homework_preparation:
        "다음 수업은 be동사의 과거형을 배울 예정입니다. 교재 29-32페이지를 미리 읽어오세요.",
    notes: "대부분의 학생들이 주어와 be동사의 일치에 어려움을 느낌. 다음 수업에서 추가 연습 필요",
};

console.log(mockLessonContent);
// AddLessonModal 인터페이스 정의
interface AddLessonModalProps {
    onClose: () => void;
    onSubmit: (data: LessonFormData) => void;
}

interface LessonFormData {
    title: string;
    date: string;
    description: string;
    learning_contents: {
        topic: string;
        details: string;
        materials: string;
        objectives: string[];
        activities: {
            name: string;
            duration: string;
            description: string;
        }[];
        homework_preparation: string;
        notes: string;
    }[];
}

// AddLessonModal 컴포넌트 수정
function AddLessonModal({ onClose, onSubmit }: AddLessonModalProps) {
    const [lessonData, setLessonData] = useState<LessonFormData>({
        title: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
        learning_contents: [
            {
                topic: "",
                details: "",
                materials: "",
                objectives: [],
                activities: [
                    {
                        name: "",
                        duration: "",
                        description: "",
                    },
                ],
                homework_preparation: "",
                notes: "",
            },
        ],
    });

    const [newObjective, setNewObjective] = useState("");

    const handleAddObjective = (contentIndex: number) => {
        if (newObjective.trim()) {
            const newContents = [...lessonData.learning_contents];
            newContents[contentIndex].objectives = [
                ...newContents[contentIndex].objectives,
                newObjective.trim(),
            ];
            setLessonData({
                ...lessonData,
                learning_contents: newContents,
            });
            setNewObjective("");
        }
    };

    const handleAddActivity = (contentIndex: number) => {
        const newContents = [...lessonData.learning_contents];
        newContents[contentIndex].activities.push({
            name: "",
            duration: "",
            description: "",
        });
        setLessonData({
            ...lessonData,
            learning_contents: newContents,
        });
    };

    return (
        <LessonModal onClick={onClose}>
            <LessonModalContent
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2>새 수업 기록 추가</h2>
                    <button className="close-button" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit(lessonData);
                    }}
                >
                    <div className="form-group">
                        <label>수업 제목</label>
                        <input
                            type="text"
                            value={lessonData.title}
                            onChange={(e) =>
                                setLessonData({
                                    ...lessonData,
                                    title: e.target.value,
                                })
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>수업 날짜</label>
                        <input
                            type="date"
                            value={lessonData.date}
                            onChange={(e) =>
                                setLessonData({
                                    ...lessonData,
                                    date: e.target.value,
                                })
                            }
                            required
                        />
                    </div>

                    {lessonData.learning_contents.map(
                        (content, contentIndex) => (
                            <div key={contentIndex} className="content-section">
                                <h3>학습 내용 {contentIndex + 1}</h3>

                                <div className="form-group">
                                    <label>주제</label>
                                    <input
                                        type="text"
                                        value={content.topic}
                                        onChange={(e) => {
                                            const newContents = [
                                                ...lessonData.learning_contents,
                                            ];
                                            newContents[contentIndex].topic =
                                                e.target.value;
                                            setLessonData({
                                                ...lessonData,
                                                learning_contents: newContents,
                                            });
                                        }}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>학습 목표</label>
                                    <div className="objective-list">
                                        {content.objectives.map((obj, i) => (
                                            <div
                                                key={i}
                                                className="objective-tag"
                                            >
                                                {obj}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newContents = [
                                                            ...lessonData.learning_contents,
                                                        ];
                                                        newContents[
                                                            contentIndex
                                                        ].objectives.splice(
                                                            i,
                                                            1
                                                        );
                                                        setLessonData({
                                                            ...lessonData,
                                                            learning_contents:
                                                                newContents,
                                                        });
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "0.5rem",
                                        }}
                                    >
                                        <input
                                            type="text"
                                            value={newObjective}
                                            onChange={(e) =>
                                                setNewObjective(e.target.value)
                                            }
                                            placeholder="새 학습 목표 입력"
                                        />
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                handleAddObjective(contentIndex)
                                            }
                                        >
                                            추가
                                        </Button>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>수업 활동</label>
                                    {content.activities.map(
                                        (activity, activityIndex) => (
                                            <div
                                                key={activityIndex}
                                                className="activity-group"
                                            >
                                                <input
                                                    type="text"
                                                    placeholder="활동명"
                                                    value={activity.name}
                                                    onChange={(e) => {
                                                        const newContents = [
                                                            ...lessonData.learning_contents,
                                                        ];
                                                        newContents[
                                                            contentIndex
                                                        ].activities[
                                                            activityIndex
                                                        ].name = e.target.value;
                                                        setLessonData({
                                                            ...lessonData,
                                                            learning_contents:
                                                                newContents,
                                                        });
                                                    }}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="소요 시간"
                                                    value={activity.duration}
                                                    onChange={(e) => {
                                                        const newContents = [
                                                            ...lessonData.learning_contents,
                                                        ];
                                                        newContents[
                                                            contentIndex
                                                        ].activities[
                                                            activityIndex
                                                        ].duration =
                                                            e.target.value;
                                                        setLessonData({
                                                            ...lessonData,
                                                            learning_contents:
                                                                newContents,
                                                        });
                                                    }}
                                                />
                                                <textarea
                                                    placeholder="활동 설명"
                                                    value={activity.description}
                                                    onChange={(e) => {
                                                        const newContents = [
                                                            ...lessonData.learning_contents,
                                                        ];
                                                        newContents[
                                                            contentIndex
                                                        ].activities[
                                                            activityIndex
                                                        ].description =
                                                            e.target.value;
                                                        setLessonData({
                                                            ...lessonData,
                                                            learning_contents:
                                                                newContents,
                                                        });
                                                    }}
                                                />
                                            </div>
                                        )
                                    )}
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            handleAddActivity(contentIndex)
                                        }
                                    >
                                        활동 추가
                                    </Button>
                                </div>
                            </div>
                        )
                    )}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "1rem",
                            marginTop: "2rem",
                        }}
                    >
                        <Button type="button" onClick={onClose}>
                            취소
                        </Button>
                        <Button type="submit">저장</Button>
                    </div>
                </form>
            </LessonModalContent>
        </LessonModal>
    );
}

interface AddAssignmentModalProps {
    onClose: () => void;
    onSubmit: (data: AssignmentFormData) => void;
}

interface AssignmentFormData {
    title: string;
    description: string;
    type: string;
    book_range?: string;
    due_date: string;
}

function AddAssignmentModal({ onClose, onSubmit }: AddAssignmentModalProps) {
    const [assignmentData, setAssignmentData] = useState<AssignmentFormData>({
        title: "",
        description: "",
        type: "제집",
        book_range: "",
        due_date: new Date().toISOString().split("T")[0],
    });

    return (
        <LessonModal onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>새 과제 추가</h2>
                    <button className="close-button" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit(assignmentData);
                    }}
                >
                    <div className="form-group">
                        <label>과제 제목</label>
                        <input
                            type="text"
                            value={assignmentData.title}
                            onChange={(e) =>
                                setAssignmentData((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                }))
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>과제 설명</label>
                        <textarea
                            value={assignmentData.description}
                            onChange={(e) =>
                                setAssignmentData((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>과제 유형</label>
                        <select
                            value={assignmentData.type}
                            onChange={(e) =>
                                setAssignmentData((prev) => ({
                                    ...prev,
                                    type: e.target.value,
                                }))
                            }
                        >
                            <option value="문제집">문제집</option>
                            <option value="작문">작문</option>
                            <option value="독해">독해</option>
                            <option value="단어시험">단어시험</option>
                            <option value="기타">기타</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>학습 범위</label>
                        <input
                            type="text"
                            value={assignmentData.book_range}
                            onChange={(e) =>
                                setAssignmentData((prev) => ({
                                    ...prev,
                                    book_range: e.target.value,
                                }))
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>마감일</label>
                        <input
                            type="date"
                            value={assignmentData.due_date}
                            onChange={(e) =>
                                setAssignmentData((prev) => ({
                                    ...prev,
                                    due_date: e.target.value,
                                }))
                            }
                            required
                        />
                    </div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "1rem",
                            marginTop: "2rem",
                        }}
                    >
                        <Button type="button" onClick={onClose}>
                            취소
                        </Button>
                        <Button type="submit">저장</Button>
                    </div>
                </form>
            </ModalContent>
        </LessonModal>
    );
}

const GptButton = styled(Button)`
    background: #10a37f; // ChatGPT 색상
    color: white;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    margin-left: 1rem;

    &:hover {
        background: #0d8a6f;
    }
`;

const QuestionsSection = styled.div`
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e2e8f0;
`;

const QuestionCard = styled.div`
    background: #f8fafc;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;

    .question-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        color: #718096;
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
    }
`;

const AnswerInput = styled.div`
    margin-top: 1rem;

    textarea {
        width: 100%;
        padding: 0.8rem;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        margin-bottom: 0.5rem;
        resize: vertical;
    }
`;

function GroupDetail() {
    const [groupData, setGroupData] = useState<GroupDetailData | null>(null);
    const [error, setError] = useState("");
    const { user } = useAuth();
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [showAddLessonModal, setShowAddLessonModal] = useState(false);
    const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
    const [selectedLessonId, setSelectedLessonId] = useState<number | null>(
        null
    );
    const [selectedLesson, setSelectedLesson] = useState<LessonRecord | null>(
        null
    );
    console.log(showAddLessonModal, showAddAssignmentModal, selectedLessonId);

    const fetchGroupDetails = async () => {
        try {
            // 실제 API 호출 대신 테스트 데이터 사용
            const mockData = {
                success: true,
                result: {
                    group: {
                        id: 1,
                        name: "중등 영어 기초반",
                        description:
                            "중학교 1-2학년 대상 기초 영어 수업입니다. 문법과 독해를 중심으로 진행됩니다.",
                        teacher_id: 1,
                        teacher_name: "김영희 선생님",
                        student_count: 5,
                        assignment_count: 8,
                        created_at: "2024-01-01",
                        updated_at: "2024-03-15",
                    },
                    students: [
                        {
                            email: "student1@test.com",
                            username: "student1",
                            name: "박민수",
                            completed_assignments: 6,
                            total_assignments: 8,
                            completion_rate: 75,
                        },
                        {
                            email: "student2@test.com",
                            username: "student2",
                            name: "이지은",
                            completed_assignments: 8,
                            total_assignments: 8,
                            completion_rate: 100,
                        },
                        {
                            email: "student3@test.com",
                            username: "student3",
                            name: "김준호",
                            completed_assignments: 4,
                            total_assignments: 8,
                            completion_rate: 50,
                        },
                        {
                            email: "student4@test.com",
                            username: "student4",
                            name: "최서연",
                            completed_assignments: 7,
                            total_assignments: 8,
                            completion_rate: 87.5,
                        },
                        {
                            email: "student5@test.com",
                            username: "student5",
                            name: "정다운",
                            completed_assignments: 5,
                            total_assignments: 8,
                            completion_rate: 62.5,
                        },
                    ],
                    lesson_records: [
                        {
                            id: 1,
                            date: "2024-03-15",
                            title: "기본 문법 - be동사",
                            description:
                                "be동사의 현재형과 과거형, 미래형에 대해 학습했습니다.",
                            learning_contents: [
                                {
                                    topic: "be동사의 현재형",
                                    details: "am, is, are의 사용법과 문장 구조",
                                    materials: "영문법 기초 교재 p.24-28",
                                },
                                {
                                    topic: "be동사의 과거형",
                                    details: "was, were의 활용과 예문 학습",
                                    materials: "영문법 기초 교재 p.29-32",
                                },
                                {
                                    topic: "be동사 의문문/부정문",
                                    details:
                                        "be동사를 활용한 의문문과 부정문 만들기",
                                    materials: "영문법 기초 교재 p.33-35",
                                },
                            ],
                            assignments: [
                                {
                                    id: 1,
                                    title: "be동사 문제집",
                                    description: "중학영문 기초 24-35페이",
                                    type: "문제집",
                                    book_range: "24-35페이지",
                                    completed_students: 4,
                                    total_students: 5,
                                    completion_rate: 80,
                                    is_completed: true,
                                    due_date: "2024-03-18",
                                    student_status: [
                                        {
                                            student_id: 1,
                                            name: "박민수",
                                            completed: true,
                                        },
                                        {
                                            student_id: 2,
                                            name: "이지은",
                                            completed: true,
                                        },
                                        {
                                            student_id: 3,
                                            name: "김준���",
                                            completed: false,
                                        },
                                        {
                                            student_id: 4,
                                            name: "최서연",
                                            completed: true,
                                        },
                                        {
                                            student_id: 5,
                                            name: "정다운",
                                            completed: true,
                                        },
                                    ],
                                },
                                {
                                    id: 2,
                                    title: "영작문 숙제",
                                    description: "자기소개 영작문 작성하기",
                                    type: "작문",
                                    completed_students: 3,
                                    total_students: 5,
                                    completion_rate: 60,
                                    is_completed: false,
                                    due_date: "2024-03-20",
                                },
                            ],
                        },
                        {
                            id: 2,
                            date: "2024-03-12",
                            title: "Reading Comprehension - Animals",
                            description: "물을 주제로 한 지문 읽기 해석 연습",
                            learning_contents: [
                                {
                                    topic: "주요 단어와 표현",
                                    details: "동물 관련 어휘와 표현 학습",
                                    materials: "Reading Explorer 1 p.45-46",
                                },
                                {
                                    topic: "본문 독해",
                                    details: "지문 읽기 및 주요 내용 파악",
                                    materials: "Reading Explorer 1 p.47-49",
                                },
                                {
                                    topic: "독해 전략",
                                    details: "주제문 찾기와 세부 정보 파악하기",
                                    materials: "학습지",
                                },
                            ],
                            assignments: [
                                {
                                    id: 3,
                                    title: "독해 문제",
                                    description: "Reading Explorer 1 Unit 3",
                                    type: "독해",
                                    book_range: "Unit 3 전체",
                                    completed_students: 5,
                                    total_students: 5,
                                    completion_rate: 100,
                                    is_completed: true,
                                    due_date: "2024-03-14",
                                },
                            ],
                        },
                        {
                            id: 3,
                            date: "2024-03-08",
                            title: "단어 시험 - 기초 1000단어",
                            description: "기초 필수 영단어 시험과 복습",
                            learning_contents: [
                                {
                                    topic: "단어 시험 준비",
                                    details: "기초 영단어 1-100개 암기",
                                    materials: "기초 영단어 1-100개 암기",
                                },
                                {
                                    topic: "단어 복습 노트",
                                    details: "틀린 단어 3번씩 쓰기",
                                    materials: "틀린 단어 3번씩 쓰기",
                                },
                            ],
                            assignments: [
                                {
                                    id: 4,
                                    title: "단어 시험 준비",
                                    description: "기초 영단어 1-100개 암기",
                                    type: "단어시험",
                                    completed_students: 4,
                                    total_students: 5,
                                    completion_rate: 80,
                                    is_completed: true,
                                    due_date: "2024-03-11",
                                },
                                {
                                    id: 5,
                                    title: "단어 복습 노트",
                                    description: "틀린 단어 3번씩 쓰기",
                                    type: "기타",
                                    completed_students: 3,
                                    total_students: 5,
                                    completion_rate: 60,
                                    is_completed: false,
                                    due_date: "2024-03-13",
                                },
                            ],
                        },
                    ],
                },
            };

            setGroupData({
                group: mockData.result.group,
                students: mockData.result.students,
                lesson_records: mockData.result.lesson_records,
            });
        } catch {
            setError("서버 오류가 발생했습니다");
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchGroupDetails();
        }
    }, [groupId, user?.id]);

    // 수업 기록 추가 핸들러
    // const handleAddLesson = async (lessonData: Partial<LessonRecord>) => {
    //     try {
    //         const response = await fetch(
    //             `https://doodler.gsong.workers.dev/api/groups/${groupId}/lessons`,
    //             {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify(lessonData),
    //             }
    //         );
    //         const data = await response.json();
    //         if (data.success) {
    //             fetchGroupDetails();
    //             setShowAddLessonModal(false);
    //         }
    //     } catch (error) {
    //         setError("수업 기록 추가 중 오류가 발생했습니다");
    //     }
    // };

    // 과제 완료 상태 토글 핸들러
    const handleToggleAssignment = async (assignmentId: number) => {
        try {
            const response = await fetch(
                `https://doodler.gsong.workers.dev/api/assignments/${assignmentId}/toggle`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ user_id: user?.id }),
                }
            );
            const data = await response.json();
            if (data.success) {
                fetchGroupDetails();
            }
        } catch (error) {
            setError("과제 상태 변경 중 오류가 발생했습니다" + error);
        }
    };

    // 모달 닫기 핸들러
    const handleCloseModal = () => {
        setSelectedLesson(null);
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

    const { group, students, lesson_records } = groupData;
    const isTeacher = user?.role === "teacher";

    return (
        <PageContainer>
            <ContentWrapper>
                <Card>
                    <GroupHeader>
                        <BackButton onClick={() => navigate("/groups")}>
                            <FiArrowLeft /> 목록으로
                        </BackButton>
                    </GroupHeader>

                    <Title>{group.name}</Title>

                    <GroupMeta>
                        <span>
                            <FiUsers /> {group.student_count} 멤버
                        </span>
                        <span>
                            <FiUser /> 선생님: {group.teacher_name}
                        </span>
                    </GroupMeta>

                    <JoinCodeSection>
                        <div>
                            <div
                                style={{
                                    marginBottom: "0.5rem",
                                    color: "#4a5568",
                                }}
                            >
                                참여 코드
                            </div>
                            <div className="code">ABCD1234</div>
                        </div>
                        <button
                            className="copy-button"
                            onClick={() => {
                                navigator.clipboard.writeText("ABCD1234");
                                // 복사 성공 알림 표시
                            }}
                        >
                            코드 복사
                        </button>
                    </JoinCodeSection>

                    <GroupDescription>{group.description}</GroupDescription>

                    <LessonRecordSection>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "1rem",
                            }}
                        >
                            <h2>수업 기록</h2>
                            {isTeacher && (
                                <AddButton
                                    onClick={() => setShowAddLessonModal(true)}
                                >
                                    새 수업 기록 추가
                                </AddButton>
                            )}
                        </div>

                        {lesson_records.map((lesson) => (
                            <LessonListItem
                                key={lesson.id}
                                onClick={() => setSelectedLesson(lesson)}
                            >
                                <div className="lesson-header">
                                    <span className="lesson-title">
                                        {lesson.title}
                                    </span>
                                    <span className="lesson-date">
                                        {new Date(
                                            lesson.date
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </LessonListItem>
                        ))}
                    </LessonRecordSection>

                    {isTeacher && students && (
                        <MembersList>
                            <h3>학생 목록</h3>
                            {students.map((student) => (
                                <MemberCard key={student.email}>
                                    <div className="member-icon">
                                        <FiUser />
                                    </div>
                                    <div className="member-info">
                                        <span className="name">
                                            {student.name}
                                        </span>
                                        <span className="username">
                                            {student.username}
                                        </span>
                                    </div>
                                </MemberCard>
                            ))}
                        </MembersList>
                    )}

                    {/* 수업 상세 모달 */}
                    {selectedLesson && (
                        <LessonModal onClick={handleCloseModal}>
                            <ModalContent onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h2>{selectedLesson.title}</h2>
                                    <div>
                                        <GptButton
                                            onClick={async () => {
                                                // GPT 요약 API 호출
                                                // 실제로는 백엔드 API를 호출하여 GPT 요약을 받아옴
                                                const summary =
                                                    "GPT가 생성한 수업 내용 요약...";
                                                setGroupData((prev) => ({
                                                    ...prev!,
                                                    lesson_records:
                                                        prev!.lesson_records.map(
                                                            (lesson) =>
                                                                lesson.id ===
                                                                selectedLesson.id
                                                                    ? {
                                                                          ...lesson,
                                                                          gpt_summary:
                                                                              summary,
                                                                      }
                                                                    : lesson
                                                        ),
                                                }));
                                            }}
                                        >
                                            GPT로 요약하기
                                        </GptButton>
                                        <button
                                            className="close-button"
                                            onClick={handleCloseModal}
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>

                                <p>{selectedLesson.description}</p>

                                <LessonContents>
                                    <h4>수업 내용</h4>
                                    {selectedLesson.learning_contents.map(
                                        (content, index) => (
                                            <div
                                                key={index}
                                                className="content-item"
                                            >
                                                <div>{index + 1}</div>
                                                <div className="topic">
                                                    {content.topic}
                                                </div>
                                                <div className="details">
                                                    {content.details}
                                                </div>
                                                {content.materials && (
                                                    <div className="materials">
                                                        학습 자료:{" "}
                                                        {content.materials}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    )}
                                </LessonContents>

                                <AssignmentSection>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <h4>과제</h4>
                                        {isTeacher && (
                                            <AddButton
                                                onClick={() => {
                                                    setSelectedLessonId(
                                                        selectedLesson.id
                                                    );
                                                    setShowAddAssignmentModal(
                                                        true
                                                    );
                                                }}
                                            >
                                                과제 추가
                                            </AddButton>
                                        )}
                                    </div>

                                    {selectedLesson.assignments.map(
                                        (assignment) => (
                                            <AssignmentCard key={assignment.id}>
                                                <div className="assignment-info">
                                                    <h4>{assignment.title}</h4>
                                                    <p>
                                                        {assignment.description}
                                                    </p>
                                                    <div
                                                        style={{
                                                            fontSize: "0.9rem",
                                                            color: "#666",
                                                        }}
                                                    >
                                                        <span>
                                                            {/* 유/형: {assignment.type} */}
                                                        </span>
                                                        {/* {assignment.book_range && (
                                                        <span
                                                            style={{
                                                                marginLeft:
                                                                    "1rem",
                                                            }}
                                                        >
                                                            범위:{" "}
                                                            {
                                                                assignment.book_range
                                                            }
                                                        </span>
                                                    )} */}
                                                        <span
                                                            style={{
                                                                marginLeft:
                                                                    "1rem",
                                                            }}
                                                        >
                                                            마감일:{" "}
                                                            {/* {new Date(
                                                            assignment.due_date
                                                        ).toLocaleDateString()} */}
                                                        </span>
                                                    </div>
                                                </div>
                                                {isTeacher ? (
                                                    <div className="completion-info">
                                                        미완료:{" "}
                                                        {assignment.student_status
                                                            ?.filter(
                                                                (status) =>
                                                                    !status.completed
                                                            )
                                                            .map(
                                                                (status) =>
                                                                    status.name
                                                            )
                                                            .join(", ") ||
                                                            "모두 완료"}
                                                    </div>
                                                ) : (
                                                    <div className="completion-status">
                                                        <Button
                                                            onClick={() =>
                                                                handleToggleAssignment(
                                                                    assignment.id
                                                                )
                                                            }
                                                            style={{
                                                                background:
                                                                    assignment.is_completed
                                                                        ? "#4CAF50"
                                                                        : "#f0f0f0",
                                                                color: assignment.is_completed
                                                                    ? "white"
                                                                    : "black",
                                                            }}
                                                        >
                                                            {assignment.is_completed
                                                                ? "완료"
                                                                : "미완료"}
                                                        </Button>
                                                    </div>
                                                )}
                                            </AssignmentCard>
                                        )
                                    )}
                                </AssignmentSection>

                                <QuestionsSection>
                                    <h4>학생 질문</h4>
                                    {selectedLesson.questions?.map(
                                        (question) => (
                                            <QuestionCard key={question.id}>
                                                <div className="question-header">
                                                    <span>
                                                        {question.student_name}
                                                    </span>
                                                    <span>
                                                        {new Date(
                                                            question.created_at
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="question-content">
                                                    {question.question}
                                                </div>
                                                {question.answer ? (
                                                    <div className="answer">
                                                        {question.answer}
                                                    </div>
                                                ) : (
                                                    <AnswerInput>
                                                        <textarea
                                                            placeholder="답변을 입력하세요..."
                                                            onChange={(e) => {
                                                                /* 답변 입력 처리 */
                                                                console.log(e);
                                                            }}
                                                        />
                                                        <Button
                                                            onClick={() => {
                                                                /* 답변 제출 처리 */
                                                            }}
                                                        >
                                                            답변 등록
                                                        </Button>
                                                    </AnswerInput>
                                                )}
                                            </QuestionCard>
                                        )
                                    )}
                                </QuestionsSection>
                            </ModalContent>
                        </LessonModal>
                    )}
                </Card>

                {/* 수업 기록 추가 모달 */}
                {showAddLessonModal && (
                    <AddLessonModal
                        onClose={() => setShowAddLessonModal(false)}
                        onSubmit={async (data) => {
                            try {
                                // API 호출 대신 임시로 데이터 추가
                                const newLessonRecord = {
                                    id: Date.now(),
                                    date: data.date,
                                    title: data.title,
                                    description: data.description,
                                    learning_contents: data.learning_contents,
                                    assignments: [],
                                };

                                setGroupData((prev) => ({
                                    ...prev!,
                                    lesson_records: [
                                        newLessonRecord,
                                        ...prev!.lesson_records,
                                    ],
                                }));
                                setShowAddLessonModal(false);
                            } catch (error) {
                                setError(
                                    "수업 기록 추가 중 오류가 발생했습니다" +
                                        error
                                );
                            }
                        }}
                    />
                )}

                {/* 과제 추가 모달 */}
                {showAddAssignmentModal && selectedLessonId && (
                    <AddAssignmentModal
                        onClose={() => setShowAddAssignmentModal(false)}
                        onSubmit={async (data) => {
                            try {
                                // API 호출 대신 임시로 데이터 추가
                                const newAssignment = {
                                    id: Date.now(),
                                    ...data,
                                    completed_students: 0,
                                    total_students: groupData.students.length,
                                    completion_rate: 0,
                                    student_status: groupData.students.map(
                                        (student) => ({
                                            student_id: parseInt(
                                                student.username.replace(
                                                    "student",
                                                    ""
                                                )
                                            ),
                                            name: student.name,
                                            completed: false,
                                        })
                                    ),
                                };

                                setGroupData((prev) => ({
                                    ...prev!,
                                    lesson_records: prev!.lesson_records.map(
                                        (lesson) =>
                                            lesson.id === selectedLessonId
                                                ? {
                                                      ...lesson,
                                                      assignments: [
                                                          ...lesson.assignments,
                                                          newAssignment,
                                                      ],
                                                  }
                                                : lesson
                                    ),
                                }));
                                setShowAddAssignmentModal(false);
                            } catch (error) {
                                setError(
                                    "과제 추가 중 오류가 발생했습니다" + error
                                );
                            }
                        }}
                    />
                )}
            </ContentWrapper>
        </PageContainer>
    );
}

export default GroupDetail;
