/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const taxonomyStore = create(
  persist(
    (set) => ({
      state: "",
      board:"",
      medium:"",
      grade:"",
      type:"",
      taxonomySubject:"",
      stateassociations: [],
      center:"",
      setState: (newState) => set(() => ({ state: newState })),
      setBoard: (newBoard) => set(() => ({ board: newBoard })),
      setMedium: (newMedium) => set(() => ({ medium: newMedium })),
      setGrade: (newGrade) => set(() => ({ grade: newGrade })),
      setType: (newType) => set(() => ({ type: newType })),
      setTaxonomySubject: (newTaxonomySubject) => set(() => ({ taxonomySubject: newTaxonomySubject })),
      setStateassociations: (newStateassociations) =>
        set((state) => ({ stateassociations: newStateassociations })),
      setCenter: (newCenter) => set(() => ({ center: newCenter})),
    }),
    {
      name: 'taxonomyTeacher',
      storage: typeof window !== 'undefined' ? localStorage : undefined,
    }
  )
);

export default taxonomyStore;
