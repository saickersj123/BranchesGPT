// hooks/useConversationsList.js
import { useState, useEffect } from 'react';
import { fetchConversations } from '../api/axiosInstance';

const useConversations = () => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const loadConversations = async () => {
      const fetchedConversations = await fetchConversations();
      setConversations(fetchedConversations);
      // 각 대화의 ID를 콘솔에 출력
      fetchedConversations.forEach(conversation => {
        console.log(`Conversation ID: ${conversation._id}`);
      });
    };

    loadConversations();
  }, []);

  return [conversations, setConversations];
};

export default useConversations;
