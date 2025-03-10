/**
 * HotLabel SDK - Implementation
 * Replaces traditional ads with AI training tasks
 */

class HotLabelSDK {
  constructor() {
    // Configuration
    this.config = {
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
    this.state = {
      initialized: false,
      userId: '',
      sessionId: '',
      tasks: {},
      taskCount: 0,
      completedTasks: 0,
      earnings: 0
    };
  }
  
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
    
    adSlots.forEach((slot, index) => {
      this.log(`Ad slot ${index+1}:`, slot);
      
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
      let newSlotsFound = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Check if node is an ad slot
              if (node.matches && node.matches(this.config.adSlotSelector)) {
                this.processAdSlot(node);
                newSlotsFound = true;
              }
              
              // Check children for ad slots
              const childSlots = node.querySelectorAll ? 
                node.querySelectorAll(this.config.adSlotSelector) : [];
              
              if (childSlots.length > 0) {
                childSlots.forEach(slot => this.processAdSlot(slot));
                newSlotsFound = true;
              }
            }
          });
        }
      });
      
      if (newSlotsFound) {
        this.log('New ad slots found and processed');
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  /**
 * Process an ad slot
 */
  processAdSlot(slot) {
    // Skip if already processed
    if (slot.hasAttribute('data-hotlabel-processed')) return;
    
    // Mark as processed
    slot.setAttribute('data-hotlabel-processed', 'true');
    
    // Save original content if not empty and not already saved
    if (slot.innerHTML.trim() && !slot.dataset.originalContent) {
      slot.dataset.originalContent = slot.innerHTML;
    }
    
    // Determine whether to replace with a task (based on replacement rate)
    if (Math.random() <= (this.config.adReplacementRate || 1.0)) {
      this.replaceWithTask(slot);
    } else {
      this.log('Ad not replaced due to replacement rate setting');
    }
  }
  
/**
 * Replace an ad slot with a labeling task
 */
replaceWithTask(slot) {
  // Generate a task ID
  const taskId = this.generateId();
  
  // Get a task
  const task = this.getTask();
  
  // Store the task
  this.state.tasks[taskId] = task;
  
  // Get the ad ID from the parent container if available
  const adId = slot.getAttribute('data-ad-id');
  
  // Find the target container
  let targetContainer;
  if (this.config.customTaskRenderer) {
    // If we're using custom rendering mode, we need to find the .p-6 container inside the slot
    // This is specific to our FileVault implementation
    targetContainer = slot.querySelector('.p-6') || slot;
  } else {
    targetContainer = slot;
  }
  
  // Create task container
  const taskElement = document.createElement('div');
  taskElement.className = 'hotlabel-task';
  taskElement.setAttribute('data-task-id', taskId);
  
  // Clear target container
  if (!this.config.customTaskRenderer) {
    targetContainer.innerHTML = '';
  }
  
  // Render task content
  taskElement.innerHTML = this.renderTaskHtml(task, taskId);
  
  // Append to target container
  targetContainer.appendChild(taskElement);
  
  // Add event listeners
  this.setupTaskEventListeners(taskElement, taskId, adId);
  
  // Increment task count
  this.state.taskCount++;
  
  this.log('Ad replaced with task', { taskId, task, adId });
}
  
  /**
   * Get a task (mock implementation)
   */
  getTask() {
    const taskTypes = ['image_classification', 'text_classification', 'vqa'];
    const randomType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
    
    let task;
    
    switch (randomType) {
      case 'image_classification':
        task = {
          type: 'image_classification',
          question: 'What object is shown in this image?',
          imageUrl: 'https://picsum.photos/300/200?random=' + Math.random(), // Random image from Lorem Picsum
          options: ['Cat', 'Dog', 'Car', 'House'],
          correctAnswer: null // In real system, this would be used for quality checks
        };
        break;
      
      case 'text_classification':
        task = {
          type: 'text_classification',
          question: 'What is the sentiment of this text?',
          text: 'I really enjoyed the service at the restaurant yesterday. The food was delicious and the staff was very friendly.',
          options: ['Positive', 'Neutral', 'Negative'],
          correctAnswer: null
        };
        break;
      
      case 'vqa':
      default:
        task = {
          type: 'vqa',
          question: 'How many people are in this image?',
          imageUrl: 'https://picsum.photos/300/200?people&random=' + Math.random(),
          options: ['0', '1', '2', '3 or more'],
          correctAnswer: null
        };
        break;
    }
    
    return task;
  }
  
  /**
   * Render HTML for a task
   */
  renderTaskHtml(task, taskId) {
    let html = `
      <div class="hotlabel-header">
        <div class="hotlabel-logo">HotLabel</div>
        <div class="hotlabel-close" data-action="close" data-task-id="${taskId}">×</div>
      </div>
      <div class="hotlabel-content">
        <div class="hotlabel-question">${task.question}</div>
    `;
    
    // Add task-specific content
    if (task.type.includes('image')) {
      html += `
        <div class="hotlabel-image">
          <img src="${task.imageUrl}" alt="Task image">
        </div>
      `;
    } else if (task.type === 'text_classification' && task.text) {
      html += `
        <div class="hotlabel-text">${task.text}</div>
      `;
    }
    
    // Add options
    html += `<div class="hotlabel-options">`;
    
    task.options.forEach((option, index) => {
      html += `
        <button class="hotlabel-option" data-action="select-option" data-task-id="${taskId}" data-option-index="${index}">
          ${option}
        </button>
      `;
    });
    
    html += `
      </div>
      <div class="hotlabel-footer">
        Help train AI by answering this question
      </div>
    `;
    
    return html;
  }
  
  /**
   * Set up event listeners for task interactions
   */
  setupTaskEventListeners(taskElement, taskId, adId) {
    // Option selection
    const options = taskElement.querySelectorAll('[data-action="select-option"]');
    options.forEach(option => {
      option.addEventListener('click', e => {
        const target = e.target;
        const optionIndex = parseInt(target.getAttribute('data-option-index') || '0');
        this.handleOptionSelection(taskId, optionIndex, adId);
      });
    });
    
    // Close button
    const closeButton = taskElement.querySelector('[data-action="close"]');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.handleTaskClose(taskId, adId);
      });
    }
  }
  
  /**
   * Handle option selection
   */
  handleOptionSelection(taskId, optionIndex, adId) {
    const task = this.state.tasks[taskId];
    if (!task) return;
    
    const selectedOption = task.options[optionIndex];
    
    this.log('Option selected', { taskId, optionIndex, selectedOption });
    
    // Record response
    const response = {
      taskId,
      userId: this.state.userId,
      sessionId: this.state.sessionId,
      publisherId: this.config.publisherId,
      taskType: task.type,
      selectedOption,
      timestamp: new Date().toISOString()
    };
    
    // In a real implementation, send to API
    this.mockSubmitResponse(response);
    
    // Update UI to show completion
    this.showTaskCompletion(taskId, adId);
    
    // Update state
    this.state.completedTasks++;
    this.state.earnings += this.getTaskValue(task.type);
  }
  
  /**
   * Get value for a task type
   */
  getTaskValue(taskType) {
    const baseRates = {
      'image': 0.03,
      'text': 0.02,
      'vqa': 0.04
    };
    
    // Extract base type from full type string
    const baseType = taskType.split('_')[0];
    return baseRates[baseType] || 0.02;
  }
  
  /**
   * Mock submission to API
   */
  mockSubmitResponse(response) {
    this.log('Response submitted (mock)', response);
    
    // In a real implementation, this would be:
    /*
    fetch(`${this.config.apiEndpoint}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(response)
    })
    .then(res => res.json())
    .then(data => {
      this.log('Response submitted successfully', data);
    })
    .catch(err => {
      console.error('Error submitting response:', err);
    });
    */
  }
  
  /**
   * Show task completion UI
   */
  showTaskCompletion(taskId, adId) {
    const taskElement = document.querySelector(`.hotlabel-task[data-task-id="${taskId}"]`);
    if (!taskElement) return;
    
    // Replace content with thank you message
    taskElement.innerHTML = `
      <div class="hotlabel-header">
        <div class="hotlabel-logo">HotLabel</div>
      </div>
      <div class="hotlabel-content hotlabel-thank-you">
        <div class="hotlabel-check">✓</div>
        <div class="hotlabel-message">Thank you!</div>
        <div class="hotlabel-submessage">Your response helps improve AI systems.</div>
      </div>
    `;
    
    // Emit a custom event to notify the container that the task is complete
    const container = taskElement.closest('.hotlabel-container');
    if (container) {
      if (!adId) {
        adId = container.getAttribute('data-ad-id');
      }
      
      const customEvent = new CustomEvent('hotlabel-task-completed', {
        detail: { adId, taskId }
      });
      document.dispatchEvent(customEvent);
    }
    
    // Fade out and remove after a delay
    setTimeout(() => {
      if (taskElement instanceof HTMLElement) {
        taskElement.style.opacity = '0';
      
        setTimeout(() => {
          if (taskElement.parentElement) {
            // Remove task and leave empty container
            taskElement.remove();
          }
        }, 500);
      }
    }, 2000);
  }
  
  /**
   * Handle task close button
   */
  handleTaskClose(taskId, adId) {
    const taskElement = document.querySelector(`.hotlabel-task[data-task-id="${taskId}"]`);
    if (!taskElement || !taskElement.parentElement) return;
    
    // Get parent
    const parent = taskElement.parentElement;
    
    // Restore original content if available
    if (parent.dataset.originalContent) {
      parent.innerHTML = parent.dataset.originalContent;
    } else {
      taskElement.remove();
    }
    
    // Emit a close event if we have an adId
    if (adId || parent.hasAttribute('data-ad-id')) {
      const closeAdId = adId || parent.getAttribute('data-ad-id');
      const customEvent = new CustomEvent('hotlabel-task-closed', {
        detail: { adId: closeAdId, taskId }
      });
      document.dispatchEvent(customEvent);
    }
    
    this.log('Task closed without completing', { taskId });
  }
  
  /**
   * Debug logging
   */
  log(...args) {
    if (this.config.debug) {
      console.log('[HotLabel]', ...args);
    }
  }
}

// Initialize global instance
const HotLabel = new HotLabelSDK();

// Add to window object
window.HotLabel = HotLabel;