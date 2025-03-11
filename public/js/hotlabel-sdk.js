/**
 * HotLabel SDK - Implementation
 * Replaces traditional ads with AI training tasks
 */
if (typeof window.HotLabelSDK === 'undefined') {
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
      apiEndpoint: 'http://localhost:8000',
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

      .hotlabel-loader {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
      }

      .hotlabel-loader::after {
        content: "";
        width: 30px;
        height: 30px;
        border: 5px solid #f3f3f3;
        border-top: 5px solid ${this.config.theme === 'dark' ? '#1565C0' : '#2196F3'};
        border-radius: 50%;
        animation: hotlabel-spin 1s linear infinite;
      }

      @keyframes hotlabel-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
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
    // Set up the ad ID for tracking
    const adId = `ad-${this.generateId()}`;
    slot.setAttribute('data-ad-id', adId);
    slot.classList.add('hotlabel-container');
    
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
    taskElement.setAttribute('data-loading', 'true');
    
    // Clear target container if not using custom renderer
    if (!this.config.customTaskRenderer) {
      targetContainer.innerHTML = '';
    }
    
    // Show loading state
    taskElement.innerHTML = `
      <div class="hotlabel-header">
        <div class="hotlabel-logo">HotLabel</div>
        <div class="hotlabel-close" data-action="close">×</div>
      </div>
      <div class="hotlabel-content">
        <div class="hotlabel-loader"></div>
      </div>
    `;
    
    // Append to target container
    targetContainer.appendChild(taskElement);
    
    // Add close event listener
    const closeButton = taskElement.querySelector('[data-action="close"]');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.handleTaskClose(adId);
      });
    }
    
    // Fetch a task from the server
    this.fetchTask(taskElement, adId);
    
    // Increment task count
    this.state.taskCount++;
  }
  
  /**
   * Fetch a task from the server
   */
  async fetchTask(taskElement, adId) {
    try {
      // Prepare user profile data for request
      const profile = this.getUserProfileData();
      
      // Make request to server
      const response = await fetch(`${this.config.apiEndpoint}/tasks/request?session_id=${this.state.sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const taskData = await response.json();
      
      if (!taskData) {
        // No task available
        this.log('No task available from server');
        this.renderNoTaskAvailable(taskElement);
        return;
      }
      
      // Store the task
      const taskId = taskData.task_id;
      this.state.tasks[taskId] = taskData;
      
      // Render task
      taskElement.removeAttribute('data-loading');
      taskElement.setAttribute('data-task-id', taskId);
      
      // Render task content
      this.renderTask(taskElement, taskData, adId);
      
      this.log('Task fetched and rendered:', { taskId, adId, taskData });
    } catch (error) {
      this.log('Error fetching task:', error);
      
      // Fallback to a mock task if server request fails
      const mockTask = this.getMockTask();
      const taskId = mockTask.task_id;
      this.state.tasks[taskId] = mockTask;
      
      // Remove loading state
      taskElement.removeAttribute('data-loading');
      taskElement.setAttribute('data-task-id', taskId);
      
      // Render the mock task with a warning
      this.renderTask(taskElement, mockTask, adId, true);
      
      this.log('Rendered mock task as fallback:', { taskId, adId, mockTask });
    }
  }
  
  /**
   * Get user profile data for task request
   */
  getUserProfileData() {
    // Get browser language
    const language = navigator.language || 'en';
    const preferredLanguages = navigator.languages || [language];
    
    // Get platform and device info
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    // Get current page info
    const currentSite = window.location.hostname;
    const currentPath = window.location.pathname;
    
    return {
      browser_info: {
        user_agent: userAgent,
        language: language,
        preferred_languages: preferredLanguages,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        platform: platform,
        is_mobile: isMobile
      },
      recent_sites: [currentSite],
      current_site_category: this.detectPageCategory(),
      current_page_topic: this.detectPageTopic(),
      time_on_page: this.getTimeOnPage(),
      interaction_depth: this.getScrollDepth(),
      metadata: {
        detected_language: language,
        active_hour: new Date().getHours(),
        engagement_signals: {
          scroll_depth: this.getScrollDepth(),
          click_pattern: 0.7 // Placeholder value
        }
      }
    };
  }
  
  /**
   * Attempt to detect page category
   */
  detectPageCategory() {
    // Simple detection based on meta tags
    const metaTags = document.querySelectorAll('meta[name="keywords"], meta[property="article:section"]');
    if (metaTags.length > 0) {
      const content = metaTags[0].getAttribute('content');
      if (content) {
        const keywords = content.split(',');
        if (keywords.length > 0) {
          return keywords[0].trim();
        }
      }
    }
    
    // Fallback to domain-based guessing
    const domain = window.location.hostname;
    if (domain.includes('news')) return 'news';
    if (domain.includes('tech')) return 'technology';
    if (domain.includes('sport')) return 'sports';
    if (domain.includes('finance')) return 'finance';
    if (domain.includes('health')) return 'health';
    
    return 'general';
  }
  
  /**
   * Attempt to detect page topic
   */
  detectPageTopic() {
    // Try to get topic from meta description or title
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      const content = metaDescription.getAttribute('content');
      if (content && content.length > 10) {
        return content.split(' ').slice(0, 3).join(' ');
      }
    }
    
    // Fallback to page title
    return document.title || 'general';
  }
  
  /**
   * Get time spent on page in seconds
   */
  getTimeOnPage() {
    // This would ideally come from a page load timestamp
    // For now, return a reasonable default
    return 60; // 1 minute
  }
  
  /**
   * Get scroll depth as a percentage
   */
  getScrollDepth() {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    
    if (scrollHeight <= clientHeight) return 1.0;
    
    const scrolled = scrollTop / (scrollHeight - clientHeight);
    return Math.min(Math.max(scrolled, 0), 1);
  }
  
  /**
   * Get a mock task when server is unavailable
   */
  getMockTask() {
    const taskTypes = ['image_classification', 'text_classification', 'vqa'];
    const randomType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
    
    let task;
    
    switch (randomType) {
      case 'image_classification':
        task = {
          task_id: `mock-${this.generateId()}`,
          track_id: "mock-track",
          language: "en",
          category: "image",
          type: "multiple-choice",
          topic: "general",
          complexity: 1,
          content: {
            image: {
              url: 'https://picsum.photos/300/200?random=' + Math.random() // Random image from Lorem Picsum
            }
          },
          task: {
            text: 'What object is shown in this image?',
            choices: {
              a: 'Cat',
              b: 'Dog',
              c: 'Car', 
              d: 'House'
            }
          },
          status: "pending"
        };
        break;
      
      case 'text_classification':
        task = {
          task_id: `mock-${this.generateId()}`,
          track_id: "mock-track",
          language: "en",
          category: "text",
          type: "multiple-choice",
          topic: "sentiment",
          complexity: 1,
          content: {
            text: {
              text: 'I really enjoyed the service at the restaurant yesterday. The food was delicious and the staff was very friendly.'
            }
          },
          task: {
            text: 'What is the sentiment of this text?',
            choices: {
              a: 'Positive',
              b: 'Neutral',
              c: 'Negative'
            }
          },
          status: "pending"
        };
        break;
      
      case 'vqa':
      default:
        task = {
          task_id: `mock-${this.generateId()}`,
          track_id: "mock-track",
          language: "en",
          category: "vqa",
          type: "multiple-choice",
          topic: "general",
          complexity: 1,
          content: {
            image: {
              url: 'https://picsum.photos/300/200?people&random=' + Math.random()
            }
          },
          task: {
            text: 'How many people are in this image?',
            choices: {
              a: '0',
              b: '1',
              c: '2',
              d: '3 or more'
            }
          },
          status: "pending"
        };
        break;
    }
    
    return task;
  }
  
  /**
   * Render a task in the task element
   */
  renderTask(taskElement, task, adId, isMockTask = false) {
    let html = `
      <div class="hotlabel-header">
        <div class="hotlabel-logo">HotLabel${isMockTask ? ' (Demo)' : ''}</div>
        <div class="hotlabel-close" data-action="close" data-task-id="${task.task_id}" data-ad-id="${adId}">×</div>
      </div>
      <div class="hotlabel-content">
        <div class="hotlabel-question">${task.task.text}</div>
    `;
    
    // Add task-specific content
    if (task.category === 'image' || task.category === 'vqa') {
      if (task.content.image && task.content.image.url) {
        html += `
          <div class="hotlabel-image">
            <img src="${task.content.image.url}" alt="Task image">
          </div>
        `;
      }
    } else if (task.category === 'text') {
      if (task.content.text && task.content.text.text) {
        html += `
          <div class="hotlabel-text">${task.content.text.text}</div>
        `;
      }
    }
    
    // Add options
    html += `<div class="hotlabel-options">`;
    
    const choices = task.task.choices || {};
    Object.entries(choices).forEach(([key, value]) => {
      html += `
        <button class="hotlabel-option" data-action="select-option" data-task-id="${task.task_id}" data-option-key="${key}" data-ad-id="${adId}">
          ${value}
        </button>
      `;
    });
    
    html += `
      </div>
      <div class="hotlabel-footer">
        Help train AI by answering this question
      </div>
    `;
    
    // Set the HTML
    taskElement.innerHTML = html;
    
    // Add event listeners
    this.setupTaskEventListeners(taskElement, task.task_id, adId);
  }
  
  /**
   * Render a message when no task is available
   */
  renderNoTaskAvailable(taskElement) {
    taskElement.innerHTML = `
      <div class="hotlabel-header">
        <div class="hotlabel-logo">HotLabel</div>
        <div class="hotlabel-close" data-action="close">×</div>
      </div>
      <div class="hotlabel-content hotlabel-thank-you">
        <div class="hotlabel-message">No tasks available right now</div>
        <div class="hotlabel-submessage">Please check back later</div>
      </div>
    `;
    
    // Add close button event listener
    const closeButton = taskElement.querySelector('[data-action="close"]');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        const container = taskElement.closest('.hotlabel-container');
        const adId = container?.getAttribute('data-ad-id');
        this.handleTaskClose(adId);
      });
    }
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
        const optionKey = target.getAttribute('data-option-key');
        this.handleOptionSelection(taskId, optionKey, adId);
      });
    });
    
    // Close button
    const closeButton = taskElement.querySelector('[data-action="close"]');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.handleTaskClose(adId);
      });
    }
  }
  
  /**
   * Handle option selection
   */
  async handleOptionSelection(taskId, optionKey, adId) {
    const task = this.state.tasks[taskId];
    if (!task) return;
    
    const selectedOption = task.task.choices[optionKey];
    
    this.log('Option selected', { taskId, optionKey, selectedOption });
    
    // Record start time to calculate response time
    const startTime = performance.now();
    const endTime = performance.now();
    const responseTimeMs = Math.round(endTime - startTime);
    
    // Prepare response data
    const response = {
      task_id: taskId,
      session_id: this.state.sessionId,
      response_data: {
        selected_choice: optionKey
      },
      response_time_ms: responseTimeMs,
      client_metadata: {
        browser: this.getBrowserName(),
        device_type: this.getDeviceType(),
        interaction_count: 1
      }
    };
    
    // Submit response to server
    try {
      const apiResponse = await fetch(`${this.config.apiEndpoint}/responses/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(response)
      });
      
      if (!apiResponse.ok) {
        throw new Error(`Server responded with status: ${apiResponse.status}`);
      }
      
      const responseData = await apiResponse.json();
      this.log('Response submitted successfully', responseData);
    } catch (error) {
      this.log('Error submitting response:', error);
      // Continue even if submission fails
    }
    
    // Update UI to show completion
    this.showTaskCompletion(taskId, adId);
    
    // Update state
    this.state.completedTasks++;
    this.state.earnings += this.getTaskValue(task.category);
  }
  
  /**
   * Get browser name from user agent
   */
  getBrowserName() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }
  
  /**
   * Get device type (mobile/desktop)
   */
  getDeviceType() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
      ? 'mobile' 
      : 'desktop';
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
    return baseRates[taskType] || 0.02;
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
    const customEvent = new CustomEvent('hotlabel-task-completed', {
      detail: { adId, taskId }
    });
    document.dispatchEvent(customEvent);
    this.log('Fired task completion event:', { adId, taskId });
    
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
  handleTaskClose(adId) {
    if (!adId) return;
    
    const container = document.querySelector(`.hotlabel-container[data-ad-id="${adId}"]`);
    if (!container) return;
    
    const taskElement = container.querySelector('.hotlabel-task');
    if (!taskElement) return;
    
    const taskId = taskElement.getAttribute('data-task-id');
    
    // If container has original content, restore it
    if (container.dataset.originalContent) {
      container.innerHTML = container.dataset.originalContent;
      container.removeAttribute('data-hotlabel-processed');
      container.removeAttribute('data-ad-id');
      container.classList.remove('hotlabel-container');
    } else {
      // Otherwise just remove the task element
      taskElement.remove();
    }
    
    // Emit a close event
    const customEvent = new CustomEvent('hotlabel-task-closed', {
      detail: { adId, taskId }
    });
    document.dispatchEvent(customEvent);
    
    this.log('Task closed without completing', { adId, taskId });
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
}