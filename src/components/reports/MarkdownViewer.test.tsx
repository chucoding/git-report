import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import MarkdownViewer from './MarkdownViewer'

describe('MarkdownViewer', () => {
  it('renders markdown text', () => {
    render(<MarkdownViewer markdown={'# Title\n\nHello **world**.'} />)
    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument()
    expect(screen.getByText('world')).toBeInTheDocument()
  })

  it('shows empty state for blank input', () => {
    render(<MarkdownViewer markdown={'   '} />)
    expect(screen.getByText('No content.')).toBeInTheDocument()
  })
})

