"""Shared fixtures for Bedtime Stories tests."""

from __future__ import annotations

import pytest
from custom_components.bedtime_stories.const import CONF_NAME, CONF_PLAYERS, DOMAIN
from pytest_homeassistant_custom_component.common import MockConfigEntry


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations: None) -> None:
    """Enable loading custom integrations in all tests."""
    return


@pytest.fixture
def mock_entry() -> MockConfigEntry:
    """Config entry with two players configured."""
    return MockConfigEntry(
        domain=DOMAIN,
        title="Bedtime Stories",
        data={
            CONF_NAME: "Bedtime Stories",
            CONF_PLAYERS: [
                "media_player.kinderzimmer",
                "media_player.handy",
            ],
        },
    )
