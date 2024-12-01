import styled from "@emotion/styled";
import { motion } from "framer-motion";

export const PageContainer = styled(motion.div)`
    min-height: 100vh;
    min-width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
`;

export const Card = styled(motion.div)<{ variant?: "auth" | "default" }>`
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 2.5rem;
    width: 95%;
    max-width: ${(props) => (props.variant === "auth" ? "450px" : "1200px")};
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    margin: 2rem auto;
    box-sizing: border-box;

    @media (max-width: 768px) {
        width: 90%;
        padding: 2rem;
        margin: 1rem auto;
        border-radius: 15px;
    }
`;

export const Title = styled.h2`
    color: #2d3748;
    font-size: 2.5rem;
    margin-bottom: 2.5rem;
    text-align: center;
    font-weight: 700;

    @media (max-width: 768px) {
        font-size: 2rem;
        margin-bottom: 2rem;
    }
`;

export const Input = styled.input`
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

    &::placeholder {
        color: #a0aec0;
    }

    &:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    @media (max-width: 768px) {
        padding: 1rem;
        font-size: 1rem;
    }
`;

export const Button = styled(motion.button)`
    width: 100%;
    padding: 1.2rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &:hover {
        background: #764ba2;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    &:active {
        transform: translateY(0);
    }

    @media (max-width: 768px) {
        padding: 1rem;
        font-size: 1rem;
    }
`;

export const ErrorMessage = styled(motion.div)`
    color: #e53e3e;
    margin-bottom: 1.5rem;
    padding: 1rem;
    border-radius: 12px;
    background: #fff5f5;
    border: 1px solid #feb2b2;
    text-align: center;
    font-size: 1.1rem;

    @media (max-width: 768px) {
        font-size: 1rem;
        padding: 0.75rem;
        margin-bottom: 1rem;
    }
`;

export const LinkText = styled.p`
    color: #4a5568;
    text-align: center;
    margin-top: 1.5rem;
    font-size: 1.1rem;

    a {
        color: #667eea;
        text-decoration: none;
        font-weight: 600;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        transition: all 0.3s ease;

        &:hover {
            background: rgba(102, 126, 234, 0.1);
            text-decoration: none;
        }
    }

    @media (max-width: 768px) {
        font-size: 1rem;
        margin-top: 1rem;
    }
`;

export const ProfileInfo = styled(motion.div)`
    background: #f7fafc;
    border-radius: 16px;
    padding: 2rem;
    margin: 2rem 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;

    @media (max-width: 768px) {
        padding: 1.5rem;
        grid-template-columns: 1fr;
    }
`;

export const ProfileItem = styled.div`
    display: flex;
    align-items: center;
    padding: 1.2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    svg {
        width: 24px;
        height: 24px;
        margin-right: 1.2rem;
        color: #667eea;
    }

    strong {
        color: #2d3748;
        margin-right: 0.8rem;
        font-size: 1.1rem;
    }

    span {
        color: #4a5568;
        font-size: 1.1rem;
        flex: 1;
    }

    @media (max-width: 768px) {
        padding: 1rem;

        svg {
            width: 20px;
            height: 20px;
            margin-right: 1rem;
        }

        strong,
        span {
            font-size: 1rem;
        }
    }
`;

export const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    box-sizing: border-box;

    @media (max-width: 768px) {
        padding: 0 1rem;
    }
`;
