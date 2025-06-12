const Prompt = require("../models/Prompt");

/**
 * Zmienia kolejność promptów na podstawie podanej listy ID
 * @param {string[]} promptIds - Lista ID promptów w nowej kolejności
 * @param {string} userId - ID użytkownika
 * @returns {Promise<boolean>} true jeśli sukces, false jeśli błąd
 */
async function reorderPrompts(promptIds, userId) {
  try {
    for (let i = 0; i < promptIds.length; i++) {
      await Prompt.updateOne(
        { _id: promptIds[i], userId },
        { $set: { position: i } }
      );
    }
    return true;
  } catch (error) {
    console.error('Error reordering prompts:', error);
    return false;
  }
}

/**
 * Formatuje prompty do formatu wymaganego przez zewnętrzne API
 * @param {Array} prompts - Lista promptów z bazy danych
 * @returns {Array} Sformatowana lista promptów
 */
function formatPromptsForApi(prompts) {
  return prompts.map(prompt => ({
    category: prompt.category || '',
    name: prompt.name || '',
    content: prompt.content || ''
  }));
}

module.exports = {
  reorderPrompts,
  formatPromptsForApi
}; 