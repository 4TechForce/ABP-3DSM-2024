import React from "react";
import styled from "styled-components";

type SidebarProps = {
    setOption: (option: "updateName" | "updatePassword" | "updateEmail") => void;
};

const Sidebar: React.FC<SidebarProps> = ({ setOption }) => {
    return (
        <StyledSidebar>
            <ul>
                <li onClick={() => setOption("updateName")}>Atualizar Nome</li>
                <li onClick={() => setOption("updatePassword")}>Atualizar Senha</li>
                <li onClick={() => setOption("updateEmail")}>Atualizar Email</li>
            </ul>
        </StyledSidebar>
    );
};

export default Sidebar;

// Styled Components
const StyledSidebar = styled.nav`
    width: 200px;
    background-color: #4b7bec;
    padding: 20px;
    color: #fff;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    border-radius: 8px 0 0 8px;
    display: flex;
    flex-direction: column;

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        margin-bottom: 20px;
        font-size: 18px;
        cursor: pointer;
        padding: 8px;
        border-radius: 4px;
        transition: background 0.3s ease;

        &:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }
    }
`;
