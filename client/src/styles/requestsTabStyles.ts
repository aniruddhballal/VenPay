export const tabStyles = `
  .tabs-container {
    margin-bottom: 32px;
  }
 
  .tabs-header {
    display: flex;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 8px;
    margin-bottom: 32px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    overflow-x: auto;
    gap: 6px;
  }
 
  .tab-button {
    flex: 1;
    min-width: 140px;
    padding: 14px 20px;
    background: rgb(255, 255, 255);
    border: 1px solid rgba(255, 255, 255, 0.15);
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    color: rgb(0, 0, 0);
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    backdrop-filter: blur(5px);
  }

  /* Color-specific default backgrounds */
  .tab-button.pending {
    background: rgb(245, 159, 11, 0.1);
    color: rgb(245, 159, 11);
    border: 2px dashed rgba(245, 158, 11, 0.2);
  }

  .tab-button.accepted {
    background: rgb(16, 185, 129, 0.1);
    color: rgb(16, 185, 129);
    border: 2px dashed rgba(16, 185, 129, 0.2);
  }

  .tab-button.declined {
    background: rgb(239, 68, 68, 0.1);
    color: rgb(239, 68, 68);
    border: 2px dashed rgba(239, 68, 68, 0.2);
  }
 
  .tab-button:focus {
    outline: none;
  }
 
  .tab-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.6s ease;
    z-index: 1;
  }
 
  .tab-button:hover::before {
    left: 100%;
  }
 
  .tab-button:hover:not(.active) {
    color: rgba(255, 255, 255, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  /* Enhanced hover states for color-specific buttons */
  .tab-button.pending:hover:not(.active) {
    background: rgb(255, 255, 255);
    color: rgb(245, 159, 11);
    border: 2px solid rgb(245, 159, 11);
  }

  .tab-button.accepted:hover:not(.active) {
    background: rgb(255, 255, 255);
    color: rgb(16, 185, 129);
    border: 2px solid rgb(16, 185, 129);
  }

  .tab-button.declined:hover:not(.active) {
    background: rgb(255, 255, 255);
    color: rgb(239, 68, 68);
    border: 2px solid rgb(239, 68, 68);
  }
 
  .tab-button.active.pending {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    border: 1px solid rgba(245, 158, 11, 0.3);
    box-shadow: 0 6px 24px rgba(245, 158, 11, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
 
  .tab-button.active.accepted {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: 1px solid rgba(16, 185, 129, 0.3);
    box-shadow: 0 6px 24px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
 
  .tab-button.active.declined {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    border: 1px solid rgba(239, 68, 68, 0.3);
    box-shadow: 0 6px 24px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
 
  .tab-content {
    min-height: 200px;
  }
 
  .tab-badge {
    background: rgba(0, 0, 0, 0.2);
    color: rgb(255, 255, 255);
    border-radius: 12px;
    padding: 3px 8px;
    font-size: 11px;
    margin-left: 8px;
    font-weight: 700;
    min-width: 20px;
    text-align: center;
    transition: all 0.3s ease;
    position: relative;
    z-index: 2;
  }
 
  .tab-button.active .tab-badge {
    background: rgba(255, 255, 255, 0.25);
    color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
 
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .tabs-header {
      padding: 6px;
      gap: 4px;
    }
   
    .tab-button {
      min-width: 110px;
      padding: 12px 16px;
      font-size: 13px;
    }
   
    .tab-badge {
      font-size: 10px;
      padding: 2px 6px;
      margin-left: 6px;
    }
  }
 
  @media (max-width: 480px) {
    .tabs-header {
      flex-direction: column;
      gap: 6px;
    }
   
    .tab-button {
      min-width: unset;
      width: 100%;
    }
  }
`;