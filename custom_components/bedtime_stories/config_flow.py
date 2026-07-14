"""Config flow for Bedtime Stories: entry name and target media players."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.helpers.selector import (
    EntitySelector,
    EntitySelectorConfig,
    TextSelector,
)

from .const import CONF_NAME, CONF_PLAYERS, DOMAIN

PLAYERS_SELECTOR = EntitySelector(
    EntitySelectorConfig(domain="media_player", multiple=True)
)


class BedtimeStoriesConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """First-time setup: name plus the list of selectable players."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        """Prompt for entry basics."""
        errors: dict[str, str] = {}
        if user_input is not None:
            name = str(user_input[CONF_NAME]).strip()
            if not name:
                errors[CONF_NAME] = "name_required"
            if not errors:
                return self.async_create_entry(
                    title=name,
                    data={
                        CONF_NAME: name,
                        CONF_PLAYERS: list(user_input.get(CONF_PLAYERS, [])),
                    },
                )

        schema = vol.Schema(
            {
                vol.Required(CONF_NAME, default="Bedtime Stories"): TextSelector(),
                vol.Optional(CONF_PLAYERS, default=[]): PLAYERS_SELECTOR,
            }
        )
        return self.async_show_form(step_id="user", data_schema=schema, errors=errors)

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> BedtimeStoriesOptionsFlow:
        """Return the options flow."""
        return BedtimeStoriesOptionsFlow()


class BedtimeStoriesOptionsFlow(config_entries.OptionsFlow):
    """Options: adjust the list of selectable target players."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> config_entries.ConfigFlowResult:
        """Edit the player list."""
        if user_input is not None:
            return self.async_create_entry(
                data={CONF_PLAYERS: list(user_input.get(CONF_PLAYERS, []))}
            )

        current = self.config_entry.options.get(
            CONF_PLAYERS, self.config_entry.data.get(CONF_PLAYERS, [])
        )
        schema = vol.Schema(
            {vol.Optional(CONF_PLAYERS, default=list(current)): PLAYERS_SELECTOR}
        )
        return self.async_show_form(step_id="init", data_schema=schema)
