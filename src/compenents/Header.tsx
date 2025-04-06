import React from 'react'
import { OffCanvas, Title } from './index'

type HeaderProps = {
  handlePastChat: (id:number) => Promise<void>;
}

const Header: React.FC<HeaderProps> = ({ handlePastChat }) => {
  return (
    <header>
      <nav className="navbar navbar-dark bg-dark fixed-top">
        {/* d-flex でFlexbox化し、3つの要素に .flex-fill を指定 */}
        <div className="container-fluid d-flex align-items-center">
          
          {/* 左側 */}
          <div className="flex-fill text-center">
            <OffCanvas handlePastChat={handlePastChat} />
          </div>
          
          {/* 中央 */}
          <div className="flex-fill text-center">
            <Title />
          </div>
          
          {/* 右側 */}
          <div className="flex-fill text-center">
            {/* 必要なら何か配置 */}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header;
