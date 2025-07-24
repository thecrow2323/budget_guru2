import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Profile, UserGroup, ViewMode } from '@/types/profile';

interface ProfileState {
  // Current state
  currentGroup: UserGroup | null;
  currentProfile: Profile | null;
  viewMode: ViewMode;
  
  // Available data
  groups: UserGroup[];
  
  // Actions
  setCurrentGroup: (group: UserGroup | null) => void;
  setCurrentProfile: (profile: Profile | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setGroups: (groups: UserGroup[]) => void;
  
  // Computed getters
  getCurrentGroupId: () => string | null;
  getCurrentProfileId: () => string | null;
  isGroupView: () => boolean;
  isIndividualView: () => boolean;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentGroup: null,
      currentProfile: null,
      viewMode: { type: 'individual', groupId: '' },
      groups: [],

      // Actions
      setCurrentGroup: (group) => {
        // FIXED: Clear any existing data when switching groups
        set({ currentGroup: group });
        
        // Auto-select first profile if switching groups
        if (group && group.profiles.length > 0) {
          const firstProfile = group.profiles[0];
          set({ 
            currentProfile: firstProfile,
            viewMode: { 
              type: 'individual', 
              profileId: firstProfile._id || firstProfile.id,
              groupId: group._id || group.id || ''
            }
          });
        }
      },

      setCurrentProfile: (profile) => {
        // FIXED: Update view mode when profile changes
        set({ currentProfile: profile });
        
        const { currentGroup } = get();
        if (profile && currentGroup) {
          set({
            viewMode: {
              type: 'individual',
              profileId: profile._id || profile.id,
              groupId: currentGroup._id || currentGroup.id || ''
            }
          });
        }
      },

      setViewMode: (mode) => {
        // FIXED: Ensure profile is updated when switching view modes
        const { currentGroup } = get();
        if (mode.type === 'individual' && mode.profileId && currentGroup) {
          const profile = currentGroup.profiles.find(p => 
            (p._id || p.id) === mode.profileId
          );
          if (profile) {
            set({ currentProfile: profile, viewMode: mode });
          } else {
            set({ viewMode: mode });
          }
        } else {
          set({ viewMode: mode });
        }
      },

      setGroups: (groups) => {
        set({ groups });
        
        // Auto-select first group if none selected
        const { currentGroup } = get();
        if (!currentGroup && groups.length > 0) {
          const firstGroup = groups[0];
          set({ currentGroup: firstGroup });
          
          if (firstGroup.profiles.length > 0) {
            const firstProfile = firstGroup.profiles[0];
            set({ 
              currentProfile: firstProfile,
              viewMode: {
                type: 'individual',
                profileId: firstProfile._id || firstProfile.id,
                groupId: firstGroup._id || firstGroup.id || ''
              }
            });
          }
        }
      },

      // Computed getters
      getCurrentGroupId: () => {
        const { currentGroup } = get();
        return currentGroup?._id || currentGroup?.id || null;
      },

      getCurrentProfileId: () => {
        const { currentProfile } = get();
        return currentProfile?._id || currentProfile?.id || null;
      },

      isGroupView: () => get().viewMode.type === 'group',

      isIndividualView: () => get().viewMode.type === 'individual',
    }),
    {
      name: 'profile-store',
      partialize: (state) => ({
        currentGroup: state.currentGroup,
        currentProfile: state.currentProfile,
        viewMode: state.viewMode,
      }),
    }
  )
);