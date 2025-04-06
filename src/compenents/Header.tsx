import React from 'react'
import { OffCanvas, Title } from './index'

type HeaderProps = {
    handlePastChat: (id:number) => Promise<void>; 
}
const Header: React.FC<HeaderProps> = ( { handlePastChat } ) => {
    return (
        <header>
        <nav className="navbar navbar-dark bg-dark fixed-top">
          <div className="container-fluid d-flex align-items-center justify-content-between">
            {/* 左側: OffCanvas トグルボタン */}
            <div style={{ width: '50px' }}>
              <OffCanvas handlePastChat={handlePastChat} />
            </div>
            {/* 中央: タイトル */}
            <div className="text-center flex-grow-1">
              <Title />
            </div>
            {/* 右側: 空要素（左側と同じ幅でタイトルを中央に配置） */}
            <div style={{ width: '50px' }}></div>
          </div>
        </nav>
      </header>
    )
}

export default Header;