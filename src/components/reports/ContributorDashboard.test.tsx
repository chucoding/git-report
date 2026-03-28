import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import ContributorDashboard from './ContributorDashboard'

describe('ContributorDashboard', () => {
  it('renders contributors and commit counts', () => {
    render(
      <ContributorDashboard
        contributors={[
          {
            login: 'alice',
            avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
            commits: 5,
            additions: 120,
            deletions: 30
          },
          {
            login: 'bob',
            avatarUrl: 'https://avatars.githubusercontent.com/u/2?v=4',
            commits: 2,
            additions: 10,
            deletions: 4
          }
        ]}
      />
    )

    expect(screen.getByText('alice')).toBeInTheDocument()
    expect(screen.getByText('5 commits')).toBeInTheDocument()
    expect(screen.getByText('+120 / -30')).toBeInTheDocument()
    expect(screen.getByText('bob')).toBeInTheDocument()
  })
})

