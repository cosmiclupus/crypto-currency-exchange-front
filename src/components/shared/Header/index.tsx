import React from 'react';
import { Container, Button, Nav, Row, Col, Dropdown } from 'react-bootstrap';
import { useAuth } from '../../../contexts/Auth';

interface HeaderProps {
  activeTab: string;
  onTabSelect: (key: string) => void;
  bidAskView?: 'bid' | 'ask'; // Agora apenas bid ou ask, sem 'both'
  onBidAskViewChange?: (view: 'bid' | 'ask') => void;
}

export default function Header({ 
  activeTab, 
  onTabSelect, 
  bidAskView = 'bid', // Default para 'bid'
  onBidAskViewChange 
}: HeaderProps) {
  const { state, logout } = useAuth();
  
  const handleLogout = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    logout();
  };
  
  const handleTabClick = (tab: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onTabSelect(tab);
  };
  
  const handleBidAskChange = (view: 'bid' | 'ask') => {
    if (onBidAskViewChange) {
      onBidAskViewChange(view);
    }
    if (activeTab !== 'bidAsk') {
      onTabSelect('bidAsk');
    }
  };
  
  return (
    <div className="bg-dark text-white py-2 mb-3">
      <Container fluid>
        <Row className="align-items-center mb-2">
          <Col md={3}>
            <h4 className="mb-0">Trading Platform</h4>
            <small>Welcome, {state.user?.username || 'trader'}!</small>
          </Col>
          
          <Col md={6}>
            <div className="d-flex justify-content-center">
              <Nav className="nav-pills">
                <Nav.Item>
                  <Nav.Link 
                    className={`px-3 py-1 mx-1 rounded-pill ${activeTab === 'statistics' ? 'active bg-primary' : 'text-light'}`}
                    onClick={handleTabClick('statistics')}
                    style={{ cursor: 'pointer' }}
                  >
                    Statistics
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    className={`px-3 py-1 mx-1 rounded-pill ${activeTab === 'globalMatches' ? 'active bg-primary' : 'text-light'}`}
                    onClick={handleTabClick('globalMatches')}
                    style={{ cursor: 'pointer' }}
                  >
                    Global matches
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    className={`px-3 py-1 mx-1 rounded-pill ${activeTab === 'trade' ? 'active bg-primary' : 'text-light'}`}
                    onClick={handleTabClick('trade')}
                    style={{ cursor: 'pointer' }}
                  >
                    Buy and Sell
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    className={`px-3 py-1 mx-1 rounded-pill ${activeTab === 'activeOrders' ? 'active bg-primary' : 'text-light'}`}
                    onClick={handleTabClick('activeOrders')}
                    style={{ cursor: 'pointer' }}
                  >
                    My active orders
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    className={`px-3 py-1 mx-1 rounded-pill ${activeTab === 'myHistory' ? 'active bg-primary' : 'text-light'}`}
                    onClick={handleTabClick('myHistory')}
                    style={{ cursor: 'pointer' }}
                  >
                    My history
                  </Nav.Link>
                </Nav.Item>
                
                {/* Manter o dropdown, mas apenas com as opções Bid e Ask */}
                <Dropdown>
                  <Dropdown.Toggle 
                    variant={activeTab === 'bidAsk' ? 'primary' : 'dark'} 
                    id="dropdown-bid-ask"
                    className="rounded-pill px-3 py-1 mx-1"
                  >
                    Bid and Ask
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item 
                      onClick={() => handleBidAskChange('bid')}
                      active={bidAskView === 'bid'}
                    >
                      Bid
                    </Dropdown.Item>
                    <Dropdown.Item 
                      onClick={() => handleBidAskChange('ask')}
                      active={bidAskView === 'ask'}
                    >
                      Ask
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </div>
          </Col>
          
          {/* Saldos e botão de logout */}
          <Col md={3} className="text-end">
            <div className="d-flex justify-content-end align-items-center">
              <div className="px-3 py-1 me-2 rounded" style={{ backgroundColor: 'rgba(0, 128, 0, 0.1)', border: '1px solid #28a745' }}>
                <span className="text-success">{(state.user?.btcBalance || 0).toFixed(3)} BTC</span>
              </div>
              <div className="px-3 py-1 me-2 rounded" style={{ backgroundColor: 'rgba(0, 0, 255, 0.05)', border: '1px solid #007bff' }}>
                <span className="text-primary">US$ {(state.user?.usdBalance || 0).toFixed(2)}</span>
              </div>
              <Button 
                variant="outline-danger" 
                onClick={handleLogout} 
                className="py-1"
                size="sm"
              >
                Logout
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}