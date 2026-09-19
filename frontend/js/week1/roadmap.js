/**
 * DecodeLabs Project 1: Execution Roadmap & Progress Manager
 * Tracks 6 development milestones (Page 12 PDF) with localStorage persistence.
 */

const STORAGE_KEY = 'decodelabs_roadmap_state';

export function initRoadmap() {
  const stepCheckboxes = document.querySelectorAll('.roadmap-checkbox');
  const progressFill = document.querySelector('.progress-bar-fill');
  const progressPercentText = document.querySelector('.roadmap-percent-label');
  const progressCountText = document.querySelector('.roadmap-count-label');

  // Load saved state
  const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

  stepCheckboxes.forEach((checkbox, index) => {
    const stepCard = checkbox.closest('.roadmap-step-card');
    const stepId = checkbox.dataset.stepId || `step_${index + 1}`;

    if (savedState[stepId]) {
      checkbox.classList.add('checked');
      checkbox.setAttribute('aria-checked', 'true');
      if (stepCard) stepCard.classList.add('completed');
    }

    checkbox.addEventListener('click', () => {
      const isChecked = checkbox.classList.toggle('checked');
      checkbox.setAttribute('aria-checked', isChecked.toString());
      if (stepCard) {
        stepCard.classList.toggle('completed', isChecked);
      }
      
      savedState[stepId] = isChecked;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));
      updateProgress();

      const event = new CustomEvent('app:toast', {
        detail: { message: isChecked ? `Milestone #${index + 1} marked completed! 🎉` : `Milestone #${index + 1} uncompleted` }
      });
      window.dispatchEvent(event);
    });
  });

  function updateProgress() {
    const total = stepCheckboxes.length;
    if (total === 0) return;
    
    let completedCount = 0;
    stepCheckboxes.forEach(cb => {
      if (cb.classList.contains('checked')) completedCount++;
    });

    const percentage = Math.round((completedCount / total) * 100);

    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }
    if (progressPercentText) {
      progressPercentText.textContent = `${percentage}%`;
    }
    if (progressCountText) {
      progressCountText.textContent = `${completedCount} of ${total} Milestones Complete`;
    }
  }

  updateProgress();
}
