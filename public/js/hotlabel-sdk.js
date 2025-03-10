/**
 * HotLabel SDK - Implementation
 * Replaces traditional ads with AI training tasks
 */

class HotLabelSDK {
  // Configuration
  config = {
    publisherId: '',
    adSlotSelector: '.ad-container',
    debug: false,
    adReplacementRate: 1.0,
    theme: 'light',
    taskTypes: ['image', 'text', 'vqa'],
    apiEndpoint: 'https://api.hotlabel.ai/v1',
    customTaskRenderer: false
  };
  
  // State tracking
  state = {
    initialized: false,
    userId: '',
    sessionId: '',
    tasks: {},
    taskCount: 0,
    completedTasks: 0,
    earnings: 0
  };
  
  /**
   * Initialize the SDK
   */
  init(config) {
    if (this.state.initialized) {
      this.log('HotLabel already initialized');
      return this;
    }
    
    // Validate publisher ID
    if (!config.publisherId) {
      console.error('HotLabel Error: publisherId is required');
      return this;
    }
    
    // Merge configurations
    this.config = { ...this.config, ...config };
    
    // Initialize IDs
    this.state.userId = this.getOrCreateUserId();
    this.state.sessionId = this.generateId();
    
    // Add styles
    this.addStyles();
    
    // Find and process ad slots
    this.scanForAdSlots();
    
    // Setup mutation observer
    this.setupMutationObserver();
    
    this.state.initialized = true;
    this.log('HotLabel initialized with config:', this.config);
    
    return this;
  }
  
  /**
   * Add CSS styles for HotLabel tasks
   */
  addStyles() {
    const styles = `
      .hotlabel-task {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        display: flex;
        flex-direction: column;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        width: 100%;
        height: 100%;
        min-height: 200px;
        margin: 0;
        padding: 0;
        position: relative;
        transition: opacity 0.3s ease;
      }
      
      .hotlabel-header {
        background: ${this.config.theme === 'dark' ? '#1565C0' : '#2196F3'};
        color: white;
        padding: 10px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .hotlabel-logo {
        font-weight: bold;
        font-size: 14px;
      }
      
      .hotlabel-close {
        cursor: pointer;
        font-size: 18px;
      }
      
      .hotlabel-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 16px;
        ${this.config.theme === 'dark' ? 'background: #333; color: white;' : ''}
      }
      
      .hotlabel-question {
        text-align: center;
        font-weight: bold;
        margin-bottom: 16px;
        font-size: 16px;
      }
      
      .hotlabel-image {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 16px;
      }
      
      .hotlabel-image img {
        max-width: 100%;
        max-height: 150px;
        border-radius: 4px;
      }
      
      .hotlabel-text {
        background: ${this.config.theme === 'dark' ? '#444' : '#f5f5f5'};
        padding: 12px;
        border-radius: 4px;
        margin-bottom: 16px;
        font-size: 14px;
      }
      
      .hotlabel-options {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
        margin-top: auto;
      }
      
      .hotlabel-option {
        background: ${this.config.theme === 'dark' ? '#444' : '#e0e0e0'};
        color: ${this.config.theme === 'dark' ? '#fff' : '#333'};
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s ease;
      }
      
      .hotlabel-option:hover {
        background: ${this.config.theme === 'dark' ? '#1976D2' : '#2196F3'};
        color: white;
      }
      
      .hotlabel-footer {
        text-align: center;
        font-size: 12px;
        color: ${this.config.theme === 'dark' ? '#aaa' : '#757575'};
        margin-top: 16px;
      }
      
      .hotlabel-thank-you {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;
      }
      
      .hotlabel-check {
        font-size: 48px;
        color: #4CAF50;
        margin-bottom: 16px;
      }
      
      .hotlabel-message {
        font-size: 16px;
        margin-bottom: 8px;
      }
      
      .hotlabel-submessage {
        font-size: 14px;
        color: ${this.config.theme === 'dark' ? '#aaa' : '#757575'};
      }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  }
  
  /**
   * Get or create user ID
   */
  getOrCreateUserId() {
    const storageKey = 'hotlabel_user_id';
    let userId = localStorage.getItem(storageKey);
    
    if (!userId) {
      userId = this.generateId();
      localStorage.setItem(storageKey, userId);
    }
    
    return userId;
  }
  
  /**
   * Generate a unique ID
   */
  generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  /**
   * Scan for ad slots
   */
  scanForAdSlots() {
    const adSlots = document.querySelectorAll(this.config.adSlotSelector);
    this.log(`Found ${adSlots.length} potential ad slots with selector "${this.config.adSlotSelector}"`);
    
    // Log each found element for debugging
    adSlots.forEach((slot, index) => {
      this.log(`Ad slot ${index+1}:`, slot);
    });
    
    adSlots.forEach(slot => {
      if (!slot.hasAttribute('data-hotlabel-processed')) {
        this.processAdSlot(slot);
      }
    });
  }
  
  /**
   * Set up mutation observer for dynamically added ad slots
   */
  setupMutationObserver() {
    const observer = new MutationObserver(mutations => {