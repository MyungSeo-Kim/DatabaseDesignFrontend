export const mockGroupDetailData = {
    group: {
        id: 1,
        name: "중등 영어 기초반",
        description: "중학교 1-2학년 대상 기초 영어 수업입니다.",
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
            gpt_summary:
                "이번 수업에서는 be동사의 기본 개념과 활용을 다뤘습니다...",
            questions: [
                {
                    id: 1,
                    student_name: "박민수",
                    question:
                        "be동사 과거형에서 was와 were를 구분하는 기준이 헷갈립니다. 다시 한 번 설명해주실 수 있나요?",
                    answer: "was는 I, he, she, it과 함께 사용하고, were는 you, we, they와 함께 사용합니다. 예를 들어, 'I was tired'와 'They were happy'처럼 사용해요.",
                    created_at: "2024-03-15T14:30:00Z",
                },
                {
                    id: 2,
                    student_name: "이지은",
                    question: "be동사로 의문문을 만들 때 주의할 점이 있나요?",
                    answer: "be동사로 의문문을 만들 때는 be동사를 문장 맨 앞으로 보내면 됩니다. 예: 'You are happy' → 'Are you happy?'",
                    created_at: "2024-03-15T15:00:00Z",
                },
                {
                    id: 3,
                    student_name: "김준호",
                    question:
                        "수업 중에 나왔던 예문들을 더 공유해주실 수 있나요?",
                    created_at: "2024-03-15T15:30:00Z",
                },
            ],
            learning_contents: [
                {
                    name: "be동사의 현재형 (am/is/are)",
                    description:
                        "주어에 따른 be동사 현재형의 올바른 사용법을 학습하고 예문을 통해 연습했습니다.",
                    duration: "20분",
                    materials: "영문법 기초 교재 p.24-28",
                },
                {
                    name: "be동사 의문문과 부정문",
                    description:
                        "be동사를 활용한 의문문과 부정문 만들기를 학습하고 짝과 함께 대화 연습을 했습니다.",
                    duration: "25분",
                    materials: "학습지, PPT",
                },
                {
                    name: "실전 활용 연습",
                    description:
                        "자기소개하기와 상대방에 대해 묻고 답하는 실전 대화 연습을 진행했습니다.",
                    duration: "15분",
                },
            ],
            assignments: [
                {
                    id: 1,
                    title: "be동사 문제집",
                    description: "중학영문법 기초 24-35페이지",
                    type: "문제집",
                    book_range: "24-35페이지",
                    completed_students: 4,
                    total_students: 5,
                    completion_rate: 80,
                    is_completed: true,
                    due_date: "2024-03-18",
                    student_status: [
                        { student_id: 1, name: "박민수", completed: true },
                        { student_id: 2, name: "이지은", completed: true },
                        { student_id: 3, name: "김준호", completed: false },
                        { student_id: 4, name: "최서연", completed: true },
                        { student_id: 5, name: "정다운", completed: true },
                    ],
                },
            ],
        },
        {
            id: 2,
            date: "2024-03-13",
            title: "현재진행형",
            description: "be동사와 현재분사를 활용한 현재진행형 학습",
            gpt_summary: "현재진행형의 구조(be동사 + 현재분사)를 배우고...",
            questions: [
                {
                    id: 4,
                    student_name: "최서연",
                    question:
                        "동사 뒤에 -ing를 붙일 때 e를 빼는 경우가 있던데, 그 규칙을 다시 설명해주실 수 있나요?",
                    answer: "마지막 e가 묵음인 경우 e를 빼고 ing를 붙입니다. 예: make → making, write → writing. 단, see → seeing처럼 ee로 끝나는 경우는 e를 뺴지 않아요.",
                    created_at: "2024-03-13T13:20:00Z",
                },
                {
                    id: 5,
                    student_name: "정다운",
                    question:
                        "현재진행형으로 미래를 나타낼 수 있다고 하셨는데, 구체적인 예시 좀 들어주실 수 있나요?",
                    answer: "네, 'I am meeting my friends tomorrow'처럼 이미 정해진 미래의 계획을 나타낼 때 현재진행형을 사용할 수 있어요. 다른 예로는 'We are having a test next week' 같은 표현이 있습니다.",
                    created_at: "2024-03-13T14:15:00Z",
                },
            ],
            learning_contents: [
                {
                    name: "현재분사 만들기",
                    description:
                        "동사의 현재분사 변화 규칙을 학습하고, 다양한 동사를 현재분사로 바꾸는 연습을 했습니다.",
                    duration: "20분",
                    materials: "영문법 기초 교재 p.30-32",
                },
                {
                    name: "현재진행형 문장 만들기",
                    description:
                        "be동사와 현재분사를 결합하여 현재진행형 문장을 만들고, 실제 상황에서 사용하는 연습을 했습니다.",
                    duration: "30분",
                    materials: "실전 문제집 p.15-18",
                },
            ],
            assignments: [
                {
                    id: 2,
                    title: "현재진행형 문제집",
                    description: "중학영문법 기초 36-45페이지",
                    type: "문제집",
                    book_range: "36-45페이지",
                    completed_students: 3,
                    total_students: 5,
                    completion_rate: 60,
                    is_completed: false,
                    due_date: "2024-03-20",
                    student_status: [
                        { student_id: 1, name: "박민수", completed: true },
                        { student_id: 2, name: "이지은", completed: true },
                        { student_id: 3, name: "김준호", completed: false },
                        { student_id: 4, name: "최서연", completed: true },
                        { student_id: 5, name: "정다운", completed: true },
                    ],
                },
            ],
        },
    ],
};
