import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    // useParams,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import GroupList from "./pages/GroupList";
import GroupCreate from "./pages/GroupCreate";
import GroupDetail from "./pages/GroupDetail";
import StudentGroupDetail from "./pages/StudentGroupDetail";
// import PrivateRoute from "./components/PrivateRoute";
import MainPage from "./pages/MainPage";

function App() {
    // const { user } = useAuth();

    // 그룹 상세 페이지로 리다이렉트하는 컴포넌트
    const GroupDetailRouter = () => {
        const { user } = useAuth();
        // const { groupId } = useParams();

        if (!user) return <Navigate to="/login" />;

        return user.role === "teacher" ? (
            <GroupDetail />
        ) : (
            <StudentGroupDetail />
        );
    };

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/main"
                        element={
                            // <PrivateRoute>
                            <MainPage />
                            // </PrivateRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            // <PrivateRoute>
                            <Profile />
                            // </PrivateRoute>
                        }
                    />
                    <Route
                        path="/groups"
                        element={
                            // <PrivateRoute>
                            <GroupList />
                            // </PrivateRoute>
                        }
                    />
                    <Route
                        path="/groups/create"
                        element={
                            // <PrivateRoute>
                            <GroupCreate />
                            // </PrivateRoute>
                        }
                    />
                    <Route
                        path="/groups/:groupId"
                        element={
                            // <PrivateRoute>
                            <GroupDetailRouter />
                            // </PrivateRoute>
                        }
                    />
                    <Route
                        path="/groups/:groupId/students/:studentId"
                        element={<StudentGroupDetail />}
                    />
                    <Route
                        path="/"
                        element={<Navigate to="/login" replace />}
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
