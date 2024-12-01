export type UserRole = "student" | "teacher";

export interface User {
    id: number;
    email: string;
    username: string;
    name: string;
    role: UserRole;
    created_at?: string;
    updated_at?: string;
}

export interface LoginResponse {
    success: boolean;
    result?: {
        user: User;
        token: string;
    };
    error?: string;
}

export interface RegisterResponse {
    success: boolean;
    result?: {
        user: User;
    };
    error?: string;
}

export interface StudyGroup {
    id: number;
    name: string;
    description: string;
    is_public: boolean;
    created_by: number;
    created_at: string;
    updated_at: string;
}

export interface GroupWithMembers extends StudyGroup {
    member_count: number;
    is_member: boolean;
    role?: "owner" | "member";
}

export interface GroupListResponse {
    success: boolean;
    result?: {
        groups: GroupWithMembers[];
        total: number;
    };
    error?: string;
}

export interface GroupDetailResponse {
    success: boolean;
    result?: {
        group: GroupWithMembers;
        members: User[];
    };
    error?: string;
}

export interface CreateGroupResponse {
    success: boolean;
    result?: {
        group: StudyGroup;
    };
    error?: string;
}

export interface TutoringGroup {
    id: number;
    name: string;
    description: string;
    teacher_id: number;
    created_at: string;
    updated_at: string;
}

export interface GroupWithDetails extends TutoringGroup {
    teacher_name: string;
    student_count: number;
    assignment_count: number;
    is_member?: boolean;
}

export interface GroupListResponse {
    success: boolean;
    result?: {
        groups: GroupWithMembers[];
        total: number;
    };
    error?: string;
}
